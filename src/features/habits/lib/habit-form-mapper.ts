import {
  HABIT_FREQUENCIES,
  HABIT_WEEKLY_DAYS,
  type Habit,
  type HabitFrequency,
  type HabitWeeklyDay,
} from "@/api/types";

import type { HabitFormInput } from "../schemas/habit-form";

const WEEKLY_DAY_SET = new Set<string>(HABIT_WEEKLY_DAYS);
const FREQUENCY_SET = new Set<string>(HABIT_FREQUENCIES);

/**
 * PocketBase may return `frequency` as a select string ("daily") or as
 * `["daily"]`. Indexing a string with [0] yields "d" and breaks validation.
 */
export function normalizeFrequency(
  value: Habit["frequency"] | HabitFrequency | string | null | undefined,
): HabitFrequency {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw === "string" && FREQUENCY_SET.has(raw)) {
    return raw as HabitFrequency;
  }
  return "daily";
}

function normalizeTargetCount(
  value: Habit["target_count"],
): number | undefined {
  if (value == null || value <= 0) return undefined;
  return value;
}

function normalizeMonthlyDay(
  frequency: HabitFrequency,
  value: Habit["monthly_day"],
): number | undefined {
  if (frequency !== "monthly") return undefined;
  if (value == null || value < 1 || value > 31) return undefined;
  return value;
}

function normalizeWeeklyDays(
  frequency: HabitFrequency,
  value: Habit["weekly_days"] | string | null | undefined,
): HabitWeeklyDay[] | undefined {
  if (frequency !== "weekly") return undefined;

  const raw = Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
      ? [value.trim()]
      : [];

  const days = raw.filter((day): day is HabitWeeklyDay =>
    WEEKLY_DAY_SET.has(day),
  );

  return days.length > 0 ? days : undefined;
}

export function habitToFormValues(habit: Habit): HabitFormInput {
  const frequency = normalizeFrequency(habit.frequency);

  return {
    name: habit.name,
    description: habit.note ?? "",
    routine: habit.routine,
    frequency,
    weeklyDays: normalizeWeeklyDays(frequency, habit.weekly_days),
    monthlyDay: normalizeMonthlyDay(frequency, habit.monthly_day),
    startDate: habit.start_date.slice(0, 10),
    reminderEnabled: habit.reminder_enabled,
    reminderTime: habit.reminder_time,
    targetCount: normalizeTargetCount(habit.target_count),
    unit: habit.unit ?? "",
  };
}
