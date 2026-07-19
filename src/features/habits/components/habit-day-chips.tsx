import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import { PressableFeedback } from "heroui-native";
import { FieldError } from "heroui-native/field-error";
import { Typography } from "heroui-native/text";

import {
  WEEKLY_DAYS,
  type WeeklyDay,
} from "@/features/habits/schemas/habit-form";

import { FieldLabel } from "./field-label";

const DAY_LABELS: Record<WeeklyDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

type HabitDayChipsProps = {
  value: WeeklyDay[] | undefined;
  onChange: (days: WeeklyDay[]) => void;
  error?: string;
};

export function HabitDayChips({ value, onChange, error }: HabitDayChipsProps) {
  const selected = value ?? [];
  const foreground = useCSSVariable("--color-foreground");
  const muted = useCSSVariable("--color-muted");
  const border = useCSSVariable("--color-border");
  const accent = useCSSVariable("--color-accent");

  const selectedBorder =
    typeof accent === "string"
      ? accent
      : typeof foreground === "string"
        ? foreground
        : "#007AFF";
  const idleBorder = typeof border === "string" ? border : "#3A3A3C";
  const selectedText =
    typeof foreground === "string" ? foreground : "#FFFFFF";
  const idleText = typeof muted === "string" ? muted : "#8A8A8F";

  const toggle = (day: WeeklyDay) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
      return;
    }
    onChange([...selected, day]);
  };

  return (
    <View className="gap-2 px-4 py-3">
      <FieldLabel required>Repeat on</FieldLabel>
      <View className="flex-row flex-wrap gap-2">
        {WEEKLY_DAYS.map((day) => {
          const isSelected = selected.includes(day);
          return (
            <PressableFeedback
              key={day}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={day}
              onPress={() => toggle(day)}
              className="h-10 min-w-11 items-center justify-center rounded-full px-3"
              style={{
                borderCurve: "continuous",
                borderWidth: isSelected ? 1.5 : 1,
                borderColor: isSelected ? selectedBorder : idleBorder,
              }}
            >
              <Typography
                type="body-sm"
                weight="semibold"
                style={{ color: isSelected ? selectedText : idleText }}
              >
                {DAY_LABELS[day]}
              </Typography>
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: selectedBorder },
                  opacity: { value: [0.2, 0.2, 0] },
                  progress: { baseDuration: 200 },
                }}
              />
            </PressableFeedback>
          );
        })}
      </View>
      {error ? <FieldError isInvalid>{error}</FieldError> : null}
    </View>
  );
}
