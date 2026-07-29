import type { Habit, HabitLog } from "@/api/types";
import { toDateKey } from "@/api/habit-logs";

import {
  addDays,
  isDueOn,
  nextDueDate,
  scheduledDatesInRange,
  startOfLocalDay,
} from "./schedule";

export type WeekDayStatus = "done" | "partial" | "missed" | "future" | "empty";

export type WeekDayStat = {
  dateKey: string;
  label: string;
  status: WeekDayStatus;
  /** 0–1 completion rate among habits due that day. */
  rate: number;
  scheduled: number;
  completed: number;
};

export type ProgressStats = {
  todayCompleted: number;
  todayTotal: number;
  todayPercent: number;
  weekDays: WeekDayStat[];
  currentStreak: number;
  bestStreak: number;
  consistencyPercent: number;
  consistencyCompleted: number;
  consistencyScheduled: number;
};

export type UpNextItem = {
  habit: Habit;
  date: Date;
};

function logDateKey(log: HabitLog): string {
  return toDateKey(log.date);
}

/** Map of dateKey → set of completed habit ids. */
function buildCompletedMap(logs: HabitLog[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const log of logs) {
    if (!log.completed) continue;
    const key = logDateKey(log);
    const set = map.get(key) ?? new Set<string>();
    set.add(log.habit);
    map.set(key, set);
  }
  return map;
}

function mondayOfWeek(now: Date): Date {
  const day = startOfLocalDay(now);
  // JS: Sun=0 … Sat=6. Monday-based week.
  const offset = (day.getDay() + 6) % 7;
  return addDays(day, -offset);
}

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

function dayStatus(
  rate: number,
  scheduled: number,
  dateKey: string,
  todayKey: string,
): WeekDayStatus {
  if (scheduled === 0) return "empty";
  if (dateKey > todayKey) return "future";
  if (rate >= 1) return "done";
  if (rate > 0) return "partial";
  return "missed";
}

/**
 * Account-level: a scheduled day is “perfect” when every due habit is completed.
 * Streak counts consecutive perfect scheduled days ending at today (or yesterday
 * if today has no scheduled habits yet / is incomplete and we still allow
 * carrying from yesterday — here we require today perfect if today has dues).
 */
function computeStreaks(
  habits: Habit[],
  completedByDate: Map<string, Set<string>>,
  now: Date,
  lookbackDays: number,
): { current: number; best: number } {
  const today = startOfLocalDay(now);
  const from = addDays(today, -(lookbackDays - 1));

  const perfectKeys: string[] = [];
  for (let cursor = from; cursor <= today; cursor = addDays(cursor, 1)) {
    const due = habits.filter((h) => isDueOn(h, cursor));
    if (due.length === 0) continue;

    const key = toDateKey(cursor);
    const done = completedByDate.get(key) ?? new Set();
    const allDone = due.every((h) => done.has(h.id));
    if (allDone) perfectKeys.push(key);
  }

  const perfectSet = new Set(perfectKeys);

  let best = 0;
  let run = 0;
  for (let cursor = from; cursor <= today; cursor = addDays(cursor, 1)) {
    const due = habits.filter((h) => isDueOn(h, cursor));
    if (due.length === 0) continue;
    const key = toDateKey(cursor);
    if (perfectSet.has(key)) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  let current = 0;
  for (let cursor = today; cursor >= from; cursor = addDays(cursor, -1)) {
    const due = habits.filter((h) => isDueOn(h, cursor));
    if (due.length === 0) continue;
    const key = toDateKey(cursor);
    if (!perfectSet.has(key)) break;
    current += 1;
  }

  return { current, best };
}

export function computeProgressStats(
  habits: Habit[],
  logs: HabitLog[],
  now = new Date(),
): ProgressStats {
  const activeHabits = habits.filter((h) => h.active);
  const completedByDate = buildCompletedMap(logs);
  const todayKey = toDateKey(now);

  const dueToday = activeHabits.filter((h) => isDueOn(h, now));
  const todayDone = completedByDate.get(todayKey) ?? new Set();
  const todayCompleted = dueToday.filter((h) => todayDone.has(h.id)).length;
  const todayTotal = dueToday.length;
  const todayPercent =
    todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const weekStart = mondayOfWeek(now);
  const weekDays: WeekDayStat[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = addDays(weekStart, i);
    const dateKey = toDateKey(day);
    const due = activeHabits.filter((h) => isDueOn(h, day));
    const doneSet = completedByDate.get(dateKey) ?? new Set();
    const completed = due.filter((h) => doneSet.has(h.id)).length;
    const scheduled = due.length;
    const rate = scheduled > 0 ? completed / scheduled : 0;
    weekDays.push({
      dateKey,
      label: WEEK_LABELS[i],
      status: dayStatus(rate, scheduled, dateKey, todayKey),
      rate,
      scheduled,
      completed,
    });
  }

  const consistencyFrom = addDays(startOfLocalDay(now), -29);
  let consistencyScheduled = 0;
  let consistencyCompleted = 0;
  for (const habit of activeHabits) {
    const dates = scheduledDatesInRange(habit, consistencyFrom, now);
    consistencyScheduled += dates.length;
    for (const key of dates) {
      if (completedByDate.get(key)?.has(habit.id)) {
        consistencyCompleted += 1;
      }
    }
  }
  const consistencyPercent =
    consistencyScheduled > 0
      ? Math.round((consistencyCompleted / consistencyScheduled) * 100)
      : 0;

  const { current: currentStreak, best: bestStreak } = computeStreaks(
    activeHabits,
    completedByDate,
    now,
    90,
  );

  return {
    todayCompleted,
    todayTotal,
    todayPercent,
    weekDays,
    currentStreak,
    bestStreak,
    consistencyPercent,
    consistencyCompleted,
    consistencyScheduled,
  };
}

export function computeUpNext(
  habits: Habit[],
  logs: HabitLog[],
  limit = 5,
  now = new Date(),
): UpNextItem[] {
  const completedByDate = buildCompletedMap(logs);
  const todayKey = toDateKey(now);
  const todayDone = completedByDate.get(todayKey) ?? new Set();

  const items: UpNextItem[] = [];

  for (const habit of habits.filter((h) => h.active)) {
    const dueToday = isDueOn(habit, now);
    const doneToday = todayDone.has(habit.id);
    const from =
      dueToday && !doneToday ? startOfLocalDay(now) : addDays(now, 1);
    const date = nextDueDate(habit, from);
    if (date) items.push({ habit, date });
  }

  items.sort((a, b) => a.date.getTime() - b.date.getTime());
  return items.slice(0, limit);
}

export function momentumCopy(percent: number): string {
  if (percent >= 85) {
    return "Great momentum — you’re staying consistent.";
  }
  if (percent >= 60) {
    return "Solid pace. Keep showing up for what’s scheduled.";
  }
  if (percent >= 30) {
    return "A few wins stack up. Focus on today’s list.";
  }
  if (percent > 0) {
    return "Every check-in counts. Start with one habit today.";
  }
  return "Complete habits on Today to build your consistency picture.";
}

export function addDaysSafe(date: Date, days: number): Date {
  return addDays(date, days);
}
