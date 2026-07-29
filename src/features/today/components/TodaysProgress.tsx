import { CalendarSyncIcon, ChevronRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Typography } from "heroui-native";
import { useMemo } from "react";
import { type ColorValue, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { useTodayHabitLogs, useTodayHabits } from "@/api";
import CircularProgress from "@/components/CircularProgress";
import { isDueOn } from "@/features/progress/lib/schedule";

import StatCard from "./StatCard";

const TodaysProgress = () => {
  const border = useCSSVariable("--color-border");
  const muted = useCSSVariable("--color-muted");

  const accentColor = "#8851c2";
  const trackColor = typeof border === "string" ? border : "#E5E5EA";
  const mutedColor =
    typeof muted === "string" ? (muted as ColorValue) : undefined;

  const { data: habits = [] } = useTodayHabits();
  const { data: todayLogs = [] } = useTodayHabitLogs();

  const { completed, total, percent, lastCompleted } = useMemo(() => {
    const now = new Date();
    const due = habits.filter((h) => isDueOn(h, now));
    const doneIds = new Set(
      todayLogs.filter((l) => l.completed).map((l) => l.habit),
    );
    const completedCount = due.filter((h) => doneIds.has(h.id)).length;
    const totalCount = due.length;

    const completedLogs = todayLogs
      .filter((log) => log.completed && log.completed_at)
      .sort((a, b) =>
        (b.completed_at ?? "").localeCompare(a.completed_at ?? ""),
      );
    const at = completedLogs[0]?.completed_at;
    let time: string | null = null;
    if (at) {
      const date = new Date(at);
      if (!Number.isNaN(date.getTime())) {
        time = date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });
      }
    }

    return {
      completed: completedCount,
      total: totalCount,
      percent:
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      lastCompleted: time,
    };
  }, [habits, todayLogs]);

  return (
    <StatCard
      title="Habits"
      trailing={
        lastCompleted ? (
          <View className="flex-row items-center gap-1">
            <Typography type="body-xs" weight="medium" color="muted">
              {lastCompleted}
            </Typography>
            <HugeiconsIcon
              icon={ChevronRightIcon}
              size={16}
              color={mutedColor ?? "muted"}
            />
          </View>
        ) : undefined
      }
      icon={CalendarSyncIcon}
      accentColor={accentColor}
      value={completed}
      unit={`of ${total} completed`}
      accessibilityLabel={`${completed} of ${total} habits completed`}
      graphic={
        <CircularProgress
          value={percent}
          progressColor={accentColor}
          trackColor={trackColor}
          accessibilityLabel={`${completed} of ${total} habits completed`}
        />
      }
      onPress={() => router.navigate("/(app)/progress")}
    />
  );
};

export default TodaysProgress;
