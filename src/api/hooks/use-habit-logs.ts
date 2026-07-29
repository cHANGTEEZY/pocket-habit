import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";

import { habitLogsApi, toDateKey, todayDateKey } from "@/api/habit-logs";
import type { HabitLog } from "@/api/types";
import { ApiError, formatPocketBaseError } from "@/utils/errors";

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

export function useToggleHabitLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      completed,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
    }) => {
      try {
        return await habitLogsApi.toggle(habitId, date, completed);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: habitLogKeys.all });
    },
  });
}
