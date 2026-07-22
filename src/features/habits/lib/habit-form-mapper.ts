import type { Habit } from "@/api/types";

import type { HabitFormInput } from "../schemas/habit-form";

export function habitToFormValues(habit: Habit): HabitFormInput {
  return {
    name: habit.name,
    description: habit.note ?? "",
    routine: habit.routine,
    frequency: habit.frequency[0] ?? "daily",
    weeklyDays: habit.weekly_days,
    monthlyDay: habit.monthly_day,
    startDate: habit.start_date.slice(0, 10),
    reminderEnabled: habit.reminder_enabled,
    reminderTime: habit.reminder_time,
    targetCount: habit.target_count,
    unit: habit.unit ?? "",
  };
}
