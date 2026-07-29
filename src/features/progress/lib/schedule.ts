import {
  HABIT_WEEKLY_DAYS,
  type Habit,
  type HabitFrequency,
  type HabitWeeklyDay,
} from "@/api/types";
import { toDateKey } from "@/api/habit-logs";
import { normalizeFrequency } from "@/features/habits/lib/habit-form-mapper";

const WEEKDAY_BY_INDEX = HABIT_WEEKLY_DAYS;

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfLocalDay(next);
}

function parseStartDate(value: string): Date {
  const key = toDateKey(value);
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function normalizeWeeklyDays(
  value: Habit["weekly_days"] | string | null | undefined,
): HabitWeeklyDay[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  return raw.filter((day): day is HabitWeeklyDay =>
    (HABIT_WEEKLY_DAYS as readonly string[]).includes(day),
  );
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function weekdayName(date: Date): HabitWeeklyDay {
  return WEEKDAY_BY_INDEX[date.getDay()];
}

/**
 * Whether a habit is scheduled on a given calendar day
 * (same semantics as PocketBase today filter).
 */
export function isDueOn(habit: Habit, date: Date): boolean {
  if (!habit.active) return false;

  const day = startOfLocalDay(date);
  const start = parseStartDate(habit.start_date);
  if (day < start) return false;

  const frequency: HabitFrequency = normalizeFrequency(habit.frequency);

  if (frequency === "daily") return true;

  if (frequency === "weekly") {
    const days = normalizeWeeklyDays(habit.weekly_days);
    return days.includes(weekdayName(day));
  }

  if (frequency === "monthly") {
    const target = habit.monthly_day;
    if (target == null || target < 1) return false;
    const dim = daysInMonth(day.getFullYear(), day.getMonth());
    const effective = Math.min(target, dim);
    return day.getDate() === effective;
  }

  return false;
}

/** All scheduled dates for a habit in [from, to] inclusive. */
export function scheduledDatesInRange(
  habit: Habit,
  from: Date,
  to: Date,
): string[] {
  const start = startOfLocalDay(from);
  const end = startOfLocalDay(to);
  const keys: string[] = [];

  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    if (isDueOn(habit, cursor)) {
      keys.push(toDateKey(cursor));
    }
  }

  return keys;
}

/**
 * Next due date on or after `from`.
 * For “up next” after completing today, pass tomorrow as `from`.
 */
export function nextDueDate(habit: Habit, from = new Date()): Date | null {
  if (!habit.active) return null;

  let cursor = startOfLocalDay(from);
  // Cap search: weekly ≤7, monthly ≤366, daily ≤1 — use 400 days max.
  for (let i = 0; i < 400; i += 1) {
    if (isDueOn(habit, cursor)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return null;
}

export function formatNextDueLabel(date: Date, now = new Date()): string {
  const today = startOfLocalDay(now);
  const target = startOfLocalDay(date);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays < 7) {
    return target.toLocaleDateString(undefined, { weekday: "short" });
  }

  return target.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export { addDays, startOfLocalDay, weekdayName };
