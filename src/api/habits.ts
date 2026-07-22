import { ClientResponseError } from "pocketbase";

import type { HabitsListFilters } from "@/api/habit-list-filters";
import { buildHabitsListFilter } from "@/api/habit-list-filters";

import type {
  CreateHabitInput,
  Habit,
  HabitWeeklyDay,
  HabitWriteRecord,
  UpdateHabitInput,
} from "@/api/types";
import { pb } from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const HABITS_COLLECTION = "Habits";

const WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const satisfies readonly HabitWeeklyDay[];

function requireUserId(): string {
  const userId = pb.authStore.record?.id;
  if (!userId) {
    throw new Error("You must be signed in to manage habits.");
  }
  return userId;
}

function weekdayName(date = new Date()): HabitWeeklyDay {
  return WEEKDAY_NAMES[date.getDay()];
}

/**
 * Habits due today by schedule:
 * - daily → every day
 * - weekly → today's weekday is in weekly_days
 * - monthly → monthly_day matches today's date
 *
 * `start_date <= @todayEnd` only means the habit has already begun
 * (hide not-yet-started habits). It is not the schedule itself.
 */
export function buildTodayHabitsFilter(now = new Date()): string {
  const weekday = weekdayName(now);
  const monthDay = now.getDate();

  return (
    `active = true && start_date <= @todayEnd && (` +
    `frequency ?= "daily" || ` +
    `(frequency ?= "weekly" && weekly_days ?= "${weekday}") || ` +
    `(frequency ?= "monthly" && monthly_day = ${monthDay})` +
    `)`
  );
}

/** Map app/form input → PocketBase create/update body. */
export function toHabitWriteRecord(
  values: CreateHabitInput,
  options?: { active?: boolean; userId?: string },
): HabitWriteRecord {
  const userId = options?.userId ?? requireUserId();
  const note = values.description.trim();

  const record: HabitWriteRecord = {
    user_id: [userId],
    name: values.name.trim(),
    routine: values.routine,
    // Select maxSelect is 0 (multi) in admin — send as array.
    frequency: [values.frequency],
    weekly_days:
      values.frequency === "weekly" ? (values.weeklyDays ?? []) : [],
    start_date: values.startDate,
    reminder_enabled: values.reminderEnabled,
    reminder_time: values.reminderEnabled ? values.reminderTime.trim() : "",
    unit: values.unit.trim(),
    active: options?.active ?? true,
  };

  // PocketBase note min length is 5 when present.
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

function toHabitUpdateRecord(
  values: UpdateHabitInput,
  userId: string,
): Partial<HabitWriteRecord> {
  const record: Partial<HabitWriteRecord> = {
    user_id: [userId],
  };

  if (values.name !== undefined) {
    record.name = values.name.trim();
  }
  if (values.routine !== undefined) {
    record.routine = values.routine;
  }
  if (values.frequency !== undefined) {
    record.frequency = [values.frequency];
    record.weekly_days =
      values.frequency === "weekly" ? (values.weeklyDays ?? []) : [];
    if (values.frequency === "monthly" && values.monthlyDay != null) {
      record.monthly_day = values.monthlyDay;
    }
  } else if (values.weeklyDays !== undefined) {
    record.weekly_days = values.weeklyDays;
  }
  if (values.monthlyDay !== undefined && values.frequency !== "weekly") {
    record.monthly_day = values.monthlyDay;
  }
  if (values.startDate !== undefined) {
    record.start_date = values.startDate;
  }
  if (values.reminderEnabled !== undefined) {
    record.reminder_enabled = values.reminderEnabled;
    record.reminder_time = values.reminderEnabled
      ? (values.reminderTime ?? "").trim()
      : "";
  } else if (values.reminderTime !== undefined) {
    record.reminder_time = values.reminderTime.trim();
  }
  if (values.unit !== undefined) {
    record.unit = values.unit.trim();
  }
  if (values.active !== undefined) {
    record.active = values.active;
  }
  if (values.description !== undefined) {
    const note = values.description.trim();
    if (note.length >= 5) {
      record.note = note;
    }
  }
  if (values.targetCount !== undefined) {
    record.target_count = values.targetCount;
  }

  return record;
}

export const habitsApi = {
  hasAny: async (): Promise<boolean> => {
    requireUserId();
    const result = await pb.collection(HABITS_COLLECTION).getList<Habit>(1, 1, {
      fields: "id",
    });
    return result.totalItems > 0;
  },

  list: async (filters: HabitsListFilters): Promise<Habit[]> => {
    // Ownership is enforced by collection listRule (user_id.id ?= @request.auth.id).
    requireUserId();
    const filter = buildHabitsListFilter(filters);

    logger.info("habitsApi.list filter", { filter });

    return pb.collection(HABITS_COLLECTION).getFullList<Habit>({
      filter,
      sort: "-created",
    });
  },

  getById: async (id: string): Promise<Habit> => {
    return pb.collection(HABITS_COLLECTION).getOne<Habit>(id);
  },

  create: async (input: CreateHabitInput): Promise<Habit> => {
    const payload = toHabitWriteRecord(input);
    try {
      return await pb.collection(HABITS_COLLECTION).create<Habit>(payload);
    } catch (error) {
      logger.error("habitsApi.create failed", {
        message: formatPocketBaseError(error),
        payload,
        data: error instanceof ClientResponseError ? error.data : undefined,
        status: error instanceof ClientResponseError ? error.status : undefined,
      });
      throw error;
    }
  },

  update: async (id: string, input: UpdateHabitInput): Promise<Habit> => {
    const userId = requireUserId();
    const payload = toHabitUpdateRecord(input, userId);
    try {
      return await pb.collection(HABITS_COLLECTION).update<Habit>(id, payload);
    } catch (error) {
      logger.error("habitsApi.update failed", {
        message: formatPocketBaseError(error),
        id,
        payload,
        data: error instanceof ClientResponseError ? error.data : undefined,
        status: error instanceof ClientResponseError ? error.status : undefined,
      });
      throw error;
    }
  },

  remove: async (id: string): Promise<boolean> => {
    return pb.collection(HABITS_COLLECTION).delete(id);
  },
};

export const todayApi = {
  /**
   * Habits scheduled for today for the signed-in user.
   * Schedule = daily | weekly (weekday match) | monthly (day-of-month match).
   */
  getTodayHabits: async (): Promise<Habit[]> => {
    requireUserId();
    const filter = buildTodayHabitsFilter();

    logger.info("todayApi.getTodayHabits filter", { filter });

    return pb.collection(HABITS_COLLECTION).getFullList<Habit>({
      filter,
      sort: "start_date",
    });
  },
};
