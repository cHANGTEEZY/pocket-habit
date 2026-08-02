import { useMemo } from "react";
import { View } from "react-native";

import { router } from "expo-router";
import { Typography } from "heroui-native/text";

import {
  toDateKey,
  useHabitLogsInRange,
  useHabits,
  useHasHabits,
  useRecentHabitLogs,
} from "@/api";
import EmptyComponent from "@/components/EmptyComponent";
import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";

import { ProgressConsistencyCard } from "./components/ProgressConsistencyCard";
import { ProgressRecentActivity } from "./components/ProgressRecentActivity";
import { ProgressUpNext } from "./components/ProgressUpNext";
import { ProgressWeekCard } from "./components/ProgressWeekCard";
import ProgressSkeleton from "./components/ProgressSkeleton";
import { addDays, startOfLocalDay } from "./lib/schedule";
import { computeProgressStats, computeUpNext } from "./lib/stats";

function rangeFromToday(daysBack: number): { from: string; to: string } {
  const today = startOfLocalDay(new Date());
  return {
    from: toDateKey(addDays(today, -daysBack)),
    to: toDateKey(today),
  };
}

export default function Progress() {
  const { from, to } = useMemo(() => rangeFromToday(89), []);

  const {
    data: habits = [],
    isPending: habitsPending,
    isError: habitsError,
    error: habitsErr,
  } = useHabits({ status: "active", routine: "all" });
  const { data: hasAnyHabits = false, isPending: hasAnyPending } =
    useHasHabits();
  const {
    data: logs = [],
    isPending: logsPending,
    isError: logsError,
    error: logsErr,
  } = useHabitLogsInRange(from, to);
  const { data: recentLogs = [] } = useRecentHabitLogs(8);

  const isLoading = habitsPending || logsPending || hasAnyPending;
  const isError = habitsError || logsError;
  const error = habitsErr ?? logsErr;

  const stats = useMemo(
    () => computeProgressStats(habits, logs),
    [habits, logs],
  );
  const upNext = useMemo(() => computeUpNext(habits, logs, 5), [habits, logs]);

  const showEmptyLibrary = !isLoading && !isError && !hasAnyHabits;

  return (
    <View collapsable={false} className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title="Progress"
        trailing={
          <ProfileButton
            onPress={() => router.navigate("/(screens)/settings")}
            size="sm"
            color="accent"
            variant="default"
          />
        }
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="mt-3 gap-4 px-4">
          {isLoading ? (
            <ProgressSkeleton />
          ) : isError ? (
            <Typography type="body-sm" className="px-1 text-danger">
              {error?.message ?? "Couldn’t load progress."}
            </Typography>
          ) : showEmptyLibrary ? (
            <EmptyComponent
              title="No habits yet"
              description="Create a habit and check it off on Today to start building your consistency report."
              actionLabel="Add a habit"
              onAction={() =>
                router.navigate({
                  pathname: "/(app)/habits",
                  params: { openAddHabitForm: "true" },
                })
              }
            />
          ) : (
            <>
              <ProgressWeekCard weekDays={stats.weekDays} />
              {/* <ProgressTodayCard
                completed={stats.todayCompleted}
                total={stats.todayTotal}
                percent={stats.todayPercent}
              /> */}
              <ProgressConsistencyCard
                percent={stats.consistencyPercent}
                completed={stats.consistencyCompleted}
                scheduled={stats.consistencyScheduled}
                currentStreak={stats.currentStreak}
                bestStreak={stats.bestStreak}
              />
              <ProgressUpNext items={upNext} />
              <ProgressRecentActivity logs={recentLogs} />
            </>
          )}
        </View>
      </CollapsingLargeHeader>
    </View>
  );
}
