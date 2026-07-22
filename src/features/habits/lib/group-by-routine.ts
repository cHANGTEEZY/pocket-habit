import type { Habit, HabitRoutine } from "@/api/types";
import { HABIT_ROUTINES } from "@/api/types";

export const ROUTINE_LABEL: Record<HabitRoutine, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export function groupByRoutine(habits: Habit[]): {
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
