import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import ProgressCard from "@/components/ProgressCard";
import { Typography } from "heroui-native/text";

import { CARD_ACCENT } from "../lib/card-colors";
import type { WeekDayStat } from "../lib/stats";
import { weekCopy } from "../lib/stats";

type ProgressWeekCardProps = {
  weekDays: WeekDayStat[];
};

function DayDot({
  day,
  accentColor,
}: {
  day: WeekDayStat;
  accentColor: string;
}) {
  const border = useCSSVariable("--color-border");
  const muted = useCSSVariable("--color-muted");
  const surface = useCSSVariable("--color-surface-secondary");

  const borderColor = typeof border === "string" ? border : "#E5E5EA";
  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";
  const surfaceColor =
    typeof surface === "string" ? surface : "rgba(128,128,128,0.15)";

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
            icon={Tick01Icon}
            size={20}
            color="#FFFFFF"
            strokeWidth={3}
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

export function ProgressWeekCard({ weekDays }: ProgressWeekCardProps) {
  const color = CARD_ACCENT.week;

  return (
    <ProgressCard
      leadingTitle="This week"
      accentColor={color}
      trailingTitle="Mon–Sun"
      subtitle={weekCopy(weekDays)}
      separator
      contentClassName="gap-5"
    >
      <View className="flex-row">
        {weekDays.map((day) => (
          <DayDot key={day.dateKey} day={day} accentColor={color} />
        ))}
      </View>
    </ProgressCard>
  );
}
