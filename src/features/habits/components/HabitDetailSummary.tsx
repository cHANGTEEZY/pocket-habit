import { View } from "react-native";

import type { Habit } from "@/api/types";

import { FREQUENCIES } from "../data/form-data";
import { normalizeFrequency } from "../lib/habit-form-mapper";

type HabitDetailSummaryProps = {
  habit: Habit;
};

function formatFrequency(habit: Habit): string {
  const primary = normalizeFrequency(habit.frequency);
  const match = FREQUENCIES.find((item) => item.value === primary);
  return match?.title ?? primary;
}

function formatStartDate(startDate: string): string {
  const parsed = new Date(`${startDate.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return startDate.slice(0, 10);
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HabitDetailSummary({ habit }: HabitDetailSummaryProps) {
  return (
    <View className="gap-3">
      {/* <Typography type="h5" weight="semibold">
        Details
      </Typography> */}

      {/* <View
        className="gap-3 rounded-4xl bg-surface px-4 py-4"
        style={{ borderCurve: "continuous" }}
      >
        <View className="flex-row items-center justify-between gap-3">
          <Typography type="body-sm" color="muted">
            Status
          </Typography>
          <Typography
            type="body-sm"
            weight="semibold"
            className={habit.active ? "text-foreground" : "text-muted"}
          >
            {habit.active ? "Active" : "Inactive"}
          </Typography>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Typography type="body-sm" color="muted">
            Time of day
          </Typography>
          <Typography type="body-sm" weight="semibold">
            {ROUTINE_LABEL[habit.routine]}
          </Typography>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Typography type="body-sm" color="muted">
            Schedule
          </Typography>
          <Typography type="body-sm" weight="semibold">
            {formatFrequency(habit)}
          </Typography>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Typography type="body-sm" color="muted">
            Starts
          </Typography>
          <Typography type="body-sm" weight="semibold">
            {formatStartDate(habit.start_date)}
          </Typography>
        </View>

        {habit.note?.trim() ? (
          <View className="gap-1 pt-1">
            <Typography type="body-sm" color="muted">
              Note
            </Typography>
            <Typography type="body-sm" className="leading-relaxed">
              {habit.note.trim()}
            </Typography>
          </View>
        ) : null}
      </View> */}
    </View>
  );
}
