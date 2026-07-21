import * as z from "zod";

import {
  HABIT_FREQUENCIES,
  HABIT_ROUTINES,
  HABIT_WEEKLY_DAYS,
  type CreateHabitInput,
  type HabitWeeklyDay,
} from "@/api/types";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Display order for day chips (Mon → Sun). Values match `HabitWeeklyDay`. */
export const WEEKLY_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const satisfies readonly HabitWeeklyDay[];

export type WeeklyDay = HabitWeeklyDay;

export const habitFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Habit name is required")
      .max(100, "Habit name must be less than 100 characters"),

    description: z
      .string()
      .trim()
      .max(255, "Description must be less than 255 characters"),

    routine: z.enum(HABIT_ROUTINES, {
      message: "Select a routine",
    }),

    frequency: z.enum(HABIT_FREQUENCIES, {
      message: "Select a frequency",
    }),

    weeklyDays: z.array(z.enum(HABIT_WEEKLY_DAYS)).optional(),

    monthlyDay: z
      .number()
      .int()
      .min(1, "Monthly day must be between 1 and 31")
      .max(31, "Monthly day must be between 1 and 31")
      .optional(),

    startDate: z.string().min(1, "Start date is required"),

    reminderEnabled: z.boolean(),

    reminderTime: z.string(),

    targetCount: z
      .number()
      .int()
      .min(1, "Target must be at least 1")
      .max(1000, "Target is too large")
      .optional(),

    unit: z
      .string()
      .trim()
      .max(30, "Unit must be less than 30 characters"),
  })
  .superRefine((data, ctx) => {
    if (
      data.frequency === "weekly" &&
      (!data.weeklyDays || data.weeklyDays.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weeklyDays"],
        message: "Select at least one day for a weekly habit",
      });
    }

    if (data.frequency === "monthly" && !data.monthlyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["monthlyDay"],
        message: "Select a day of the month for a monthly habit",
      });
    }

    if (data.frequency !== "weekly" && data.weeklyDays?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weeklyDays"],
        message: "Weekly days should only be set for weekly habits",
      });
    }

    if (data.frequency !== "monthly" && data.monthlyDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["monthlyDay"],
        message: "Monthly day should only be set for monthly habits",
      });
    }

    if (data.reminderEnabled) {
      if (!data.reminderTime.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reminderTime"],
          message: "Reminder time is required when reminders are enabled",
        });
      } else if (!timeRegex.test(data.reminderTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reminderTime"],
          message: "Reminder time must be in HH:mm format",
        });
      }
    }
  });

export type HabitFormValues = z.output<typeof habitFormSchema>;
export type HabitFormInput = z.input<typeof habitFormSchema>;

/** Ensures form output stays assignable to the API create input. */
type AssertCreateHabitCompatible =
  HabitFormValues extends CreateHabitInput ? true : never;
const _createHabitCompatible: AssertCreateHabitCompatible = true;
void _createHabitCompatible;

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
