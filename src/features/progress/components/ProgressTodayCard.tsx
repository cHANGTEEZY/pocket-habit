import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import CircularProgress from "@/components/CircularProgress";
import { Typography } from "heroui-native/text";

type ProgressTodayCardProps = {
  completed: number;
  total: number;
  percent: number;
};

export function ProgressTodayCard({
  completed,
  total,
  percent,
}: ProgressTodayCardProps) {
  const accent = useCSSVariable("--color-accent");
  const border = useCSSVariable("--color-border");
  const progressColor = typeof accent === "string" ? accent : "#007AFF";
  const trackColor = typeof border === "string" ? border : "#E5E5EA";

  return (
    <View
      className="items-center gap-4 rounded-4xl bg-surface px-5 py-6"
      style={{ borderCurve: "continuous" }}
      accessibilityRole="summary"
      accessibilityLabel={`${completed} of ${total} habits completed today, ${percent} percent`}
    >
      <Typography type="body-sm" weight="medium" className="text-muted">
        Today
      </Typography>
      <CircularProgress
        value={percent}
        size={128}
        strokeWidth={10}
        progressColor={progressColor}
        trackColor={trackColor}
      >
        <View className="items-center">
          <Typography type="h1" weight="semibold" className="text-foreground">
            {percent}%
          </Typography>
        </View>
      </CircularProgress>
      <Typography type="body" className="text-muted">
        {total === 0
          ? "Nothing scheduled today"
          : `${completed} of ${total} done`}
      </Typography>
    </View>
  );
}
