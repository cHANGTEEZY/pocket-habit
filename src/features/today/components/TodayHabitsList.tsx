import { useMemo, useState } from "react";
import { View } from "react-native";

import * as Haptics from "expo-haptics";
import { Typography } from "heroui-native/text";

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

type TodayHabitsListProps = {
  habits: Habit[];
};

export default function TodayHabitsList({ habits }: TodayHabitsListProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const sections = useMemo(() => groupByRoutine(habits), [habits]);

  const toggle = (habit: Habit) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(habit.id)) next.delete(habit.id);
      else next.add(habit.id);
      return next;
    });
  };

  if (habits.length === 0) {
    return (
      <View className="rounded-4xl bg-surface px-4 py-5" style={{ borderCurve: "continuous" }}>
        <Typography type="body" weight="semibold" className="text-foreground">
          Nothing scheduled today
        </Typography>
        <Typography type="body-sm" color="muted" className="mt-1 leading-relaxed">
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
