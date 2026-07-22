import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";

import { habitsApi, todayApi } from "@/api/habits";
import type {
  CreateHabitInput,
  Habit,
  UpdateHabitInput,
} from "@/api/types";
import type { HabitsListFilters } from "@/api/habit-list-filters";
import { ApiError, formatPocketBaseError } from "@/utils/errors";

function normalizePocketBaseError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  return new ApiError(
    formatPocketBaseError(error),
    error instanceof ClientResponseError ? error.status : undefined,
    error instanceof ClientResponseError ? error.data : undefined,
  );
}

export const habitKeys = {
  all: ["habits"] as const,
  lists: () => [...habitKeys.all, "list"] as const,
  list: (filters: HabitsListFilters) =>
    [...habitKeys.lists(), filters] as const,
  hasAny: () => [...habitKeys.all, "hasAny"] as const,
  details: () => [...habitKeys.all, "detail"] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
  today: () => [...habitKeys.all, "today"] as const,
};

export function useHabits(
  filters: HabitsListFilters,
  options?: Omit<UseQueryOptions<Habit[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: habitKeys.list(filters),
    queryFn: async () => {
      try {
        return await habitsApi.list(filters);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

export function useHasHabits(
  options?: Omit<UseQueryOptions<boolean, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: habitKeys.hasAny(),
    queryFn: async () => {
      try {
        return await habitsApi.hasAny();
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

export function useHabit(
  id: string,
  options?: Omit<UseQueryOptions<Habit, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: async () => {
      try {
        return await habitsApi.getById(id);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    enabled: Boolean(id),
    ...options,
  });
}

export function useTodayHabits(
  options?: Omit<UseQueryOptions<Habit[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: habitKeys.today(),
    queryFn: async () => {
      try {
        return await todayApi.getTodayHabits();
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    ...options,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHabitInput) => {
      try {
        return await habitsApi.create(data);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    onSuccess: (habit) => {
      void queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.hasAny() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.today() });
      queryClient.setQueryData(habitKeys.detail(habit.id), habit);
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateHabitInput;
    }) => {
      try {
        return await habitsApi.update(id, data);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    onSuccess: (habit) => {
      void queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.hasAny() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.today() });
      queryClient.setQueryData(habitKeys.detail(habit.id), habit);
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await habitsApi.remove(id);
      } catch (error) {
        throw normalizePocketBaseError(error);
      }
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.hasAny() });
      void queryClient.invalidateQueries({ queryKey: habitKeys.today() });
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) });
    },
  });
}
