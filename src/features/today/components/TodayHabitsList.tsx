import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { View } from "react-native";

import { Typography } from "heroui-native/text";

import {
  todayDateKey,
  useTodayHabitLogs,
  useToggleHabitLog,
} from "@/api";
import type { Habit } from "@/api/types";
import HabitPill from "@/components/HabitPill";
import {
  HabitRowCheckbox,
  HabitRowIcon,
  HabitRowTitle,
} from "@/features/habits/components/habit-row-parts";
import {
  groupByRoutine,
  ROUTINE_LABEL,
} from "@/features/habits/lib/group-by-routine";
import { logger } from "@/utils/logger";

type TodayHabitsListProps = {
  habits: Habit[];
};

export default function TodayHabitsList({ habits }: TodayHabitsListProps) {
  const { data: todayLogs = [] } = useTodayHabitLogs();
  const toggleLog = useToggleHabitLog();

  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const log of todayLogs) {
      if (log.completed) ids.add(log.habit);
    }
    return ids;
  }, [todayLogs]);

  const sections = useMemo(() => groupByRoutine(habits), [habits]);

  const toggle = (habit: Habit) => {
    const completed = completedIds.has(habit.id);
    void toggleLog
      .mutateAsync({
        habitId: habit.id,
        date: todayDateKey(),
        completed: !completed,
      })
      .catch((error) => {
        logger.error("Failed to toggle habit log", error);
      });
  };

  if (habits.length === 0) {
    return (
      <View
        className="rounded-4xl bg-surface px-4 py-5"
        style={{ borderCurve: "continuous" }}
      >
        <Typography type="body" weight="semibold" className="text-foreground">
          Nothing scheduled today
        </Typography>
        <Typography
          type="body-sm"
          color="muted"
          className="mt-1 leading-relaxed"
        >
          Habits due today will show up here, grouped by time of day.
        </Typography>
      </View>
    );
  }

  return (
    <View className="gap-6">
      {sections.map(({ routine, habits: sectionHabits }) => (
        <View key={routine} className="gap-2.5">
          <Typography
            type="body-sm"
            weight="medium"
            color="muted"
            accessibilityRole="header"
            className="px-1"
          >
            {ROUTINE_LABEL[routine]}
          </Typography>
          <View className="gap-2.5">
            {sectionHabits.map((habit) => {
              const completed = completedIds.has(habit.id);

              return (
                <HabitPill
                  key={habit.id}
                  onPress={() => toggle(habit)}
                  haptic={{
                    type: "impact",
                    style: completed
                      ? Haptics.ImpactFeedbackStyle.Light
                      : Haptics.ImpactFeedbackStyle.Medium,
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: completed }}
                  accessibilityLabel={`${habit.name}${completed ? ", completed" : ""}`}
                >
                  <HabitPill.Leading>
                    <HabitRowIcon habit={habit} completed={completed} />
                  </HabitPill.Leading>
                  <HabitPill.Body>
                    <HabitRowTitle habit={habit} completed={completed} />
                  </HabitPill.Body>
                  <HabitPill.Trailing>
                    <HabitRowCheckbox completed={completed} />
                  </HabitPill.Trailing>
                </HabitPill>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
