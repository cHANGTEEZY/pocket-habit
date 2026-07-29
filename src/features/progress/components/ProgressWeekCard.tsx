import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import { Typography } from "heroui-native/text";

import type { WeekDayStat } from "../lib/stats";

type ProgressWeekCardProps = {
  weekDays: WeekDayStat[];
  currentStreak: number;
  bestStreak: number;
};

function DayDot({ day }: { day: WeekDayStat }) {
  const accent = useCSSVariable("--color-accent");
  const border = useCSSVariable("--color-border");
  const muted = useCSSVariable("--color-muted");
  const surface = useCSSVariable("--color-surface-secondary");
  const accentFg = useCSSVariable("--color-accent-foreground");

  const accentColor = typeof accent === "string" ? accent : "#007AFF";
  const borderColor = typeof border === "string" ? border : "#E5E5EA";
  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";
  const surfaceColor =
    typeof surface === "string" ? surface : "rgba(128,128,128,0.15)";
  const checkColor = typeof accentFg === "string" ? accentFg : "#FFFFFF";

  let backgroundColor = "transparent";
  let borderWidth = 1.5;
  let borderColorActive = borderColor;

  switch (day.status) {
    case "done":
      backgroundColor = accentColor;
      borderWidth = 0;
      break;
    case "partial":
      backgroundColor = surfaceColor;
      borderColorActive = accentColor;
      break;
    case "missed":
      backgroundColor = surfaceColor;
      borderWidth = 0;
      break;
    case "future":
    case "empty":
      backgroundColor = "transparent";
      borderColorActive = borderColor;
      borderWidth = 1.5;
      break;
  }

  return (
    <View className="flex-1 items-center gap-2">
      <Typography type="body-xs" weight="medium" className="text-muted">
        {day.label}
      </Typography>
      <View
        className="size-9 items-center justify-center rounded-full"
        style={{
          backgroundColor,
          borderWidth,
          borderColor: borderColorActive,
        }}
        accessibilityLabel={`${day.label}: ${day.status}`}
      >
        {day.status === "done" ? (
          <HugeiconsIcon
            icon={Tick02Icon}
            size={16}
            color={checkColor}
            strokeWidth={2}
          />
        ) : day.status === "partial" ? (
          <Typography
            type="body-xs"
            style={{ color: mutedColor, letterSpacing: 1 }}
          >
            ···
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

export function ProgressWeekCard({
  weekDays,
  currentStreak,
  bestStreak,
}: ProgressWeekCardProps) {
  const accent = useCSSVariable("--color-accent");
  const accentColor = typeof accent === "string" ? accent : "#007AFF";

  return (
    <View
      className="gap-5 rounded-4xl bg-surface px-4 py-5"
      style={{ borderCurve: "continuous" }}
    >
      <View className="flex-row items-center justify-between px-1">
        <Typography type="h5" weight="semibold" className="text-foreground">
          This week
        </Typography>
        <Typography type="body-xs" weight="medium" className="text-muted">
          Mon–Sun
        </Typography>
      </View>

      <View className="flex-row">
        {weekDays.map((day) => (
          <DayDot key={day.dateKey} day={day} />
        ))}
      </View>

      <View className="flex-row gap-4 px-1">
        <View className="flex-1 gap-0.5">
          <Typography type="h2" weight="semibold" className="text-foreground">
            {currentStreak}
          </Typography>
          <Typography type="body-xs" className="text-muted">
            Current streak
          </Typography>
          <Typography type="body-xs" className="text-muted">
            days
          </Typography>
        </View>
        <View className="flex-1 gap-0.5">
          <Typography type="h2" weight="semibold" style={{ color: accentColor }}>
            {bestStreak}
          </Typography>
          <Typography type="body-xs" className="text-muted">
            Best streak
          </Typography>
          <Typography type="body-xs" className="text-muted">
            days
          </Typography>
        </View>
      </View>
    </View>
  );
}
