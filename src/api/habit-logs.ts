import { ClientResponseError } from "pocketbase";

import type { HabitLog } from "@/api/types";
import { pb } from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const HABIT_LOGS_COLLECTION = "habit_logs";

function requireUserId(): string {
  const userId = pb.authStore.record?.id;
  if (!userId) {
    throw new Error("You must be signed in to manage habit logs.");
  }
  return userId;
}

/** Normalize PocketBase date values to YYYY-MM-DD. */
export function toDateKey(value: string | Date): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return value.slice(0, 10);
}

export function todayDateKey(now = new Date()): string {
  return toDateKey(now);
}

type ListLogsParams = {
  from: string;
  to: string;
  habitId?: string;
  expandHabit?: boolean;
};

export const habitLogsApi = {
  listInRange: async ({
    from,
    to,
    habitId,
    expandHabit = false,
  }: ListLogsParams): Promise<HabitLog[]> => {
    requireUserId();
    const fromKey = toDateKey(from);
    const toKey = toDateKey(to);

    const parts = [`date >= "${fromKey}"`, `date <= "${toKey} 23:59:59"`];
    if (habitId) {
      parts.push(`habit = "${habitId}"`);
    }

    return pb.collection(HABIT_LOGS_COLLECTION).getFullList<HabitLog>({
      filter: parts.join(" && "),
      sort: "-date,-completed_at,-created",
      expand: expandHabit ? "habit" : undefined,
    });
  },

  listRecent: async (limit = 8): Promise<HabitLog[]> => {
    requireUserId();
    const result = await pb
      .collection(HABIT_LOGS_COLLECTION)
      .getList<HabitLog>(1, limit, {
        filter: "completed = true",
        sort: "-completed_at,-created",
        expand: "habit",
      });
    return result.items;
  },

  findForHabitDate: async (
    habitId: string,
    date: string,
  ): Promise<HabitLog | null> => {
    requireUserId();
    const dateKey = toDateKey(date);
    try {
      return await pb
        .collection(HABIT_LOGS_COLLECTION)
        .getFirstListItem<HabitLog>(
          `habit = "${habitId}" && date >= "${dateKey}" && date <= "${dateKey} 23:59:59"`,
        );
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  toggle: async (
    habitId: string,
    date: string,
    completed: boolean,
  ): Promise<HabitLog | null> => {
    const userId = requireUserId();
    const dateKey = toDateKey(date);
    const existing = await habitLogsApi.findForHabitDate(habitId, dateKey);

    if (!completed) {
      if (existing) {
        await pb.collection(HABIT_LOGS_COLLECTION).delete(existing.id);
      }
      return null;
    }

    const nowIso = new Date().toISOString();

    try {
      if (existing) {
        return await pb
          .collection(HABIT_LOGS_COLLECTION)
          .update<HabitLog>(existing.id, {
            completed: true,
            completed_at: nowIso,
          });
      }

      return await pb.collection(HABIT_LOGS_COLLECTION).create<HabitLog>({
        user: userId,
        habit: habitId,
        date: dateKey,
        completed: true,
        completed_at: nowIso,
      });
    } catch (error) {
      logger.error("habitLogsApi.toggle failed", {
        message: formatPocketBaseError(error),
        habitId,
        dateKey,
        completed,
        data: error instanceof ClientResponseError ? error.data : undefined,
      });
      throw error;
    }
  },
};
