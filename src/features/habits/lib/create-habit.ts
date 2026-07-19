import { ClientResponseError } from "pocketbase";

import { pb } from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

import type { HabitFormValues } from "../schemas/habit-form";

/** Matches the PocketBase collection name exactly (case-sensitive). */
export const HABITS_COLLECTION = "Habits";

/**
 * Map app form values → PocketBase `Habits` record fields.
 *
 * Note: in the current collection, `frequency` and `user_id` were saved with
 * maxSelect: 0 (multi). PocketBase then expects arrays, not bare strings.
 */
export function toHabitsRecord(values: HabitFormValues) {
  const userId = pb.authStore.record?.id;
  if (!userId) {
    throw new Error("You must be signed in to create a habit.");
  }

  const note = values.description.trim();
  const record: Record<string, unknown> = {
    // Relation maxSelect is 0 (multi) in admin — send as array.
    user_id: [userId],
    name: values.name.trim(),
    routine: values.routine,
    // Select maxSelect is 0 (multi) in admin — send as array.
    frequency: [values.frequency],
    weekly_days: values.frequency === "weekly" ? (values.weeklyDays ?? []) : [],
    // Date fields accept YYYY-MM-DD; full ISO is also fine.
    start_date: values.startDate,
    reminder_enabled: values.reminderEnabled,
    reminder_time: values.reminderEnabled ? values.reminderTime.trim() : "",
    unit: values.unit.trim(),
    active: true,
  };

  if (note.length >= 5) {
    record.note = note;
  }

  if (values.frequency === "monthly" && values.monthlyDay != null) {
    record.monthly_day = values.monthlyDay;
  }

  if (values.targetCount != null) {
    record.target_count = values.targetCount;
  }

  return record;
}

export async function createHabit(values: HabitFormValues) {
  const payload = toHabitsRecord(values);
  try {
    return await pb.collection(HABITS_COLLECTION).create(payload);
  } catch (error) {
    logger.error("createHabit failed", {
      message: formatPocketBaseError(error),
      payload,
      data: error instanceof ClientResponseError ? error.data : undefined,
      status: error instanceof ClientResponseError ? error.status : undefined,
    });
    throw error;
  }
}
