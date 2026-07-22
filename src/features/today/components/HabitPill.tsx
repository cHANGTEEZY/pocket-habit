import type { ComponentProps } from "react";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import {
  Book02Icon,
  Coffee01Icon,
  DropletIcon,
  Dumbbell01Icon,
  FireIcon,
  Moon02Icon,
  RepeatIcon,
  SleepingIcon,
  Sun03Icon,
  Target02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { Typography } from "heroui-native/text";

import type { Habit, HabitRoutine } from "@/api/types";
import HapticPressable from "@/components/HapticButton";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

const ROUTINE_ACCENT: Record<
  HabitRoutine,
  { iconBg: string; iconColor: string }
> = {
  morning: { iconBg: "rgba(255, 149, 0, 0.14)", iconColor: "#FF9500" },
  afternoon: { iconBg: "rgba(255, 204, 0, 0.18)", iconColor: "#C7A000" },
  evening: { iconBg: "rgba(88, 86, 214, 0.14)", iconColor: "#5856D6" },
  night: { iconBg: "rgba(99, 99, 102, 0.16)", iconColor: "#636366" },
};

const ROUTINE_FALLBACK_ICON: Record<HabitRoutine, IconData> = {
  morning: Sun03Icon,
  afternoon: Coffee01Icon,
  evening: Moon02Icon,
  night: SleepingIcon,
};

function pickHabitIcon(habit: Habit): IconData {
  const haystack = `${habit.name} ${habit.note ?? ""} ${habit.unit ?? ""}`.toLowerCase();

  if (/water|drink|hydrat|glass/.test(haystack)) return DropletIcon;
  if (/run|jog|walk|cardio/.test(haystack)) return FireIcon;
  if (/read|book|page/.test(haystack)) return Book02Icon;
  if (/gym|lift|strength|workout|exercise|dumbbell/.test(haystack))
    return Dumbbell01Icon;
  if (/meditat|focus|mindful|yoga/.test(haystack)) return Target02Icon;
  if (/repeat|daily|habit/.test(haystack)) return RepeatIcon;

  return ROUTINE_FALLBACK_ICON[habit.routine] ?? Target02Icon;
}

function habitSubtitle(habit: Habit): string | null {
  const parts: string[] = [];
  if (habit.target_count && habit.target_count > 0) {
    parts.push(
      habit.unit?.trim()
        ? `${habit.target_count} ${habit.unit.trim()}`
        : `${habit.target_count}×`,
    );
  } else if (habit.unit?.trim()) {
    parts.push(habit.unit.trim());
  } else if (habit.note?.trim()) {
    parts.push(habit.note.trim());
  }
  return parts[0] ?? null;
}

export type HabitPillProps = {
  habit: Habit;
  completed?: boolean;
  /** 0–100 optional progress for multi-count habits */
  progress?: number;
  onToggle?: (habit: Habit) => void;
  /** `today` shows completion checkbox; `library` is display-only for the habits screen */
  variant?: "today" | "library";
  onPress?: (habit: Habit) => void;
};

export default function HabitPill({
  habit,
  completed = false,
  progress,
  onToggle,
  variant = "today",
  onPress,
}: HabitPillProps) {
  const success = useCSSVariable("--color-success");
  const muted = useCSSVariable("--color-muted");

  const successColor =
    typeof success === "string" ? success : "#34C759";
  const mutedColor = typeof muted === "string" ? muted : "#8E8E93";
  const checkIconColor = "#FFFFFF";

  const accent = ROUTINE_ACCENT[habit.routine] ?? ROUTINE_ACCENT.morning;
  const icon = pickHabitIcon(habit);
  const subtitle = habitSubtitle(habit);
  const showProgress =
    typeof progress === "number" && progress > 0 && progress < 100 && !completed;
  const isLibrary = variant === "library";
  const isPaused = isLibrary && !habit.active;

  const rowClassName =
    "flex-row items-center gap-3.5 rounded-4xl bg-surface px-3.5 py-3";
  const rowStyle = {
    borderCurve: "continuous" as const,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    opacity: isPaused ? 0.72 : 1,
  };

  const content = (
    <>
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{
          backgroundColor: completed
            ? "rgba(52, 199, 89, 0.12)"
            : accent.iconBg,
          borderCurve: "continuous",
        }}
        accessible={false}
      >
        <HugeiconsIcon
          icon={icon}
          size={22}
          color={completed ? successColor : accent.iconColor}
          strokeWidth={1.75}
        />
      </View>

      <View className="min-w-0 flex-1 gap-0.5">
        <Typography
          type="body"
          weight="semibold"
          className={completed ? "text-muted" : "text-foreground"}
          style={completed ? { textDecorationLine: "line-through" } : undefined}
          numberOfLines={1}
        >
          {habit.name}
        </Typography>
        {subtitle ? (
          <Typography type="body-xs" color="muted" numberOfLines={1}>
            {subtitle}
          </Typography>
        ) : null}
      </View>

      {showProgress ? (
        <Typography type="body-xs" weight="medium" color="muted">
          {Math.round(progress)}%
        </Typography>
      ) : null}

      {isLibrary ? (
        isPaused ? (
          <Typography type="body-xs" weight="medium" color="muted">
            Inactive
          </Typography>
        ) : null
      ) : (
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{
            borderCurve: "continuous",
            backgroundColor: completed ? successColor : "transparent",
            borderWidth: completed ? 0 : 1.5,
            borderColor: mutedColor,
          }}
          accessible={false}
        >
          {completed ? (
            <HugeiconsIcon
              icon={Tick02Icon}
              size={16}
              color={checkIconColor}
              strokeWidth={2.25}
            />
          ) : null}
        </View>
      )}
    </>
  );

  if (isLibrary) {
    if (onPress) {
      return (
        <HapticPressable
          haptic={{ type: "selection" }}
          hapticTrigger="onPressIn"
          onPress={() => onPress(habit)}
          accessibilityRole="button"
          accessibilityLabel={`${habit.name}, edit habit${isPaused ? ", inactive" : ""}`}
          className={rowClassName}
          style={rowStyle}
        >
          {content}
        </HapticPressable>
      );
    }

    return (
      <View
        className={rowClassName}
        style={rowStyle}
        accessibilityRole="summary"
        accessibilityLabel={`${habit.name}${isPaused ? ", inactive" : ""}`}
      >
        {content}
      </View>
    );
  }

  return (
    <HapticPressable
      haptic={{
        type: "impact",
        style: completed
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium,
      }}
      hapticTrigger="onPressIn"
      onPress={() => onToggle?.(habit)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      accessibilityLabel={`${habit.name}${completed ? ", completed" : ""}`}
      className={rowClassName}
      style={rowStyle}
    >
      {content}
    </HapticPressable>
  );
}
