import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import PercentRing from "@/components/PercentRing";
import ProgressCard from "@/components/ProgressCard";
import { Typography } from "heroui-native/text";

import { CARD_ACCENT } from "../lib/card-colors";
import { momentumCopy } from "../lib/stats";

type ProgressConsistencyCardProps = {
  percent: number;
  completed: number;
  scheduled: number;
  currentStreak: number;
  bestStreak: number;
};

function StreakColumn({
  label,
  value,
  unit,
  accent,
  muted = false,
}: {
  label: string;
  value: number;
  unit: string;
  accent: string;
  muted?: boolean;
}) {
  const themeMuted = useCSSVariable("--color-muted");
  const dotColor = muted
    ? typeof themeMuted === "string"
      ? themeMuted
      : "#8A8A8F"
    : accent;

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-1.5">
        <View
          className="size-2.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <Typography
          type="body-sm"
          weight="semibold"
          className={muted ? "text-muted" : undefined}
          style={muted ? undefined : { color: accent }}
        >
          {label}
        </Typography>
      </View>
      <View className="flex-row items-baseline gap-1">
        <Typography
          type="h2"
          weight="semibold"
          className={muted ? "text-muted" : undefined}
          style={muted ? undefined : { color: accent }}
        >
          {value}
        </Typography>
        <Typography
          type="body-sm"
          weight="semibold"
          className={muted ? "text-muted" : undefined}
          style={muted ? undefined : { color: accent, opacity: 0.85 }}
        >
          {unit}
        </Typography>
      </View>
    </View>
  );
}

export function ProgressConsistencyCard({
  percent,
  completed,
  scheduled,
  currentStreak,
  bestStreak,
}: ProgressConsistencyCardProps) {
  const color = CARD_ACCENT.consistency;

  return (
    <ProgressCard
      leadingTitle="Consistency"
      accentColor={color}
      trailingTitle="Last 30 days"
      subtitle={momentumCopy(percent)}
      contentClassName="gap-3"
      separator={true}
      accessibilityLabel={`${percent} percent consistency over the last 30 days. 
      ${momentumCopy(percent)}. Current streak ${currentStreak} ${currentStreak > 1 ? "days" : "day"}, 
      best streak ${bestStreak} ${bestStreak > 1 ? "days" : "day"}.`}
    >
      <View className="flex-row gap-6 mb-3">
        <StreakColumn
          label="Current streak"
          value={currentStreak}
          unit={currentStreak > 1 ? "days" : "day"}
          accent={color}
        />
        <StreakColumn
          label="Best streak"
          value={bestStreak}
          unit={bestStreak > 1 ? "days" : "day"}
          accent={color}
          muted
        />
      </View>

      <View className="items-center gap-3 pt-1">
        <PercentRing
          value={percent}
          progressColor={color}
          accessibilityLabel={`${percent} percent consistency`}
        />
        <Typography type="body-sm" className="text-center text-muted">
          {scheduled === 0
            ? "No scheduled habits in the last 30 days"
            : `${completed} of ${scheduled} scheduled check-ins`}
        </Typography>
      </View>
    </ProgressCard>
  );
}
