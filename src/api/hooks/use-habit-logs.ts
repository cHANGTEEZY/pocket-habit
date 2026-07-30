import {
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";
import { useCallback, useRef, useState } from "react";

import { habitLogsApi, toDateKey, todayDateKey } from "@/api/habit-logs";
import type { HabitLog } from "@/api/types";
import { ApiError, formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

export type ToggleHabitLogInput = {
  habitId: string;
  date: string;
  completed: boolean;
};

function normalizePocketBaseError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  return new ApiError(
    formatPocketBaseError(error),
    error instanceof ClientResponseError ? error.status : undefined,
    error instanceof ClientResponseError ? error.data : undefined,
  );
}

export const habitLogKeys = {
  all: ["habit-logs"] as const,
  lists: () => [...habitLogKeys.all, "list"] as const,
  range: (from: string, to: string) =>
    [...habitLogKeys.lists(), { from, to }] as const,
  today: (date = todayDateKey()) =>
    [...habitLogKeys.all, "today", date] as const,
  recent: (limit: number) => [...habitLogKeys.all, "recent", limit] as const,
};

export function useHabitLogsInRange(
  from: string,
  to: string,
  options?: Omit<UseQueryOptions<HabitLog[], Error>, "queryKey" | "queryFn">,
) {
  const fromKey = toDateKey(from);
  const toKey = toDateKey(to);

  return useQuery({
    queryKey: habitLogKeys.range(fromKey, toKey),
    queryFn: async () => {
      try {
        return await habitLogsApi.listInRange({
          from: fromKey,
          to: toKey,
          expandHabit: true,
        });
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

export function useTodayHabitLogs(
  options?: Omit<UseQueryOptions<HabitLog[], Error>, "queryKey" | "queryFn">,
) {
  const date = todayDateKey();
  return useQuery({
    queryKey: habitLogKeys.today(date),
    queryFn: async () => {
      try {
        return await habitLogsApi.listInRange({
          from: date,
          to: date,
        });
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

export function useRecentHabitLogs(
  limit = 8,
  options?: Omit<UseQueryOptions<HabitLog[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: habitLogKeys.recent(limit),
    queryFn: async () => {
      try {
        return await habitLogsApi.listRecent(limit);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

function applyOptimisticToggle(
  queryClient: QueryClient,
  { habitId, date, completed }: ToggleHabitLogInput,
) {
  queryClient.setQueryData<HabitLog[]>(habitLogKeys.today(date), (old = []) => {
    if (!completed) {
      return old.filter((log) => log.habit !== habitId);
    }

    const existing = old.find((log) => log.habit === habitId);
    if (existing) {
      return old.map((log) =>
        log.habit === habitId
          ? {
              ...log,
              completed: true,
              completed_at: new Date().toISOString(),
            }
          : log,
      );
    }

    const now = new Date().toISOString();
    const optimistic: HabitLog = {
      id: `optimistic-${habitId}`,
      collectionId: "",
      collectionName: "habit_logs",
      user: "",
      habit: habitId,
      date,
      completed: true,
      completed_at: now,
      created: now,
      updated: now,
    };
    return [...old, optimistic];
  });
}

export function isHabitCompletedToday(
  queryClient: QueryClient,
  habitId: string,
  fallback: HabitLog[] = [],
  date = todayDateKey(),
) {
  const logs =
    queryClient.getQueryData<HabitLog[]>(habitLogKeys.today(date)) ??
    fallback;
  return logs.some((log) => log.habit === habitId && log.completed);
}

export function useToggleHabitLog() {
  const queryClient = useQueryClient();
  const queueRef = useRef(new Map<string, Promise<unknown>>());
  const pendingCountRef = useRef(0);
  const [isPending, setIsPending] = useState(false);

  const toggle = useCallback(
    (input: ToggleHabitLogInput) => {
      void queryClient.cancelQueries({ queryKey: habitLogKeys.today(input.date) });
      applyOptimisticToggle(queryClient, input);

      pendingCountRef.current += 1;
      setIsPending(true);

      const prev = queueRef.current.get(input.habitId) ?? Promise.resolve();
      const next = prev.catch(() => undefined).then(async () => {
        try {
          await habitLogsApi.toggle(
            input.habitId,
            input.date,
            input.completed,
          );
        } catch (error) {
          void queryClient.invalidateQueries({
            queryKey: habitLogKeys.today(input.date),
          });
          throw normalizePocketBaseError(error);
        }
      });

      queueRef.current.set(input.habitId, next);

      void next
        .catch((error) => {
          logger.error("Failed to toggle habit log", error);
        })
        .finally(() => {
          pendingCountRef.current -= 1;
          if (pendingCountRef.current === 0) {
            setIsPending(false);
          }
          if (queueRef.current.get(input.habitId) === next) {
            void queryClient.invalidateQueries({ queryKey: habitLogKeys.all });
          }
        });
    },
    [queryClient],
  );

  return { toggle, isPending };
}
