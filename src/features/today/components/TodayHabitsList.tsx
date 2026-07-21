import { useMemo, useState } from "react";
import { View } from "react-native";

import { Typography } from "heroui-native/text";

import type { Habit, HabitRoutine } from "@/api/types";
import { HABIT_ROUTINES } from "@/api/types";

import HabitPill from "./HabitPill";

const ROUTINE_LABEL: Record<HabitRoutine, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

type TodayHabitsListProps = {
  habits: Habit[];
};

function groupByRoutine(habits: Habit[]): {
  routine: HabitRoutine;
  habits: Habit[];
}[] {
  const buckets = Object.fromEntries(
    HABIT_ROUTINES.map((routine) => [routine, [] as Habit[]]),
  ) as Record<HabitRoutine, Habit[]>;

  for (const habit of habits) {
    const routine = HABIT_ROUTINES.includes(habit.routine)
      ? habit.routine
      : "morning";
    buckets[routine].push(habit);
  }

  return HABIT_ROUTINES.filter((routine) => buckets[routine].length > 0).map(
    (routine) => ({
      routine,
      habits: buckets[routine],
    }),
  );
}

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
            {sectionHabits.map((habit) => (
              <HabitPill
                key={habit.id}
                habit={habit}
                completed={completedIds.has(habit.id)}
                onToggle={toggle}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
