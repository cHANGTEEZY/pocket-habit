import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import CircularProgress from "@/components/CircularProgress";
import { Typography } from "heroui-native/text";

import { momentumCopy } from "../lib/stats";

type ProgressConsistencyCardProps = {
  percent: number;
  completed: number;
  scheduled: number;
};

export function ProgressConsistencyCard({
  percent,
  completed,
  scheduled,
}: ProgressConsistencyCardProps) {
  const accent = useCSSVariable("--color-accent");
  const border = useCSSVariable("--color-border");
  const progressColor = typeof accent === "string" ? accent : "#007AFF";
  const trackColor = typeof border === "string" ? border : "#E5E5EA";

  return (
    <View
      className="gap-4 rounded-4xl bg-surface px-4 py-5"
      style={{ borderCurve: "continuous" }}
      accessibilityRole="summary"
      accessibilityLabel={`${percent} percent consistency over the last 30 days`}
    >
      <Typography type="h5" weight="semibold" className="text-foreground">
        Consistency
      </Typography>

      <View className="items-center gap-3 py-2">
        <CircularProgress
          value={percent}
          size={112}
          strokeWidth={9}
          progressColor={progressColor}
          trackColor={trackColor}
        >
          <Typography type="h2" weight="semibold" className="text-foreground">
            {percent}%
          </Typography>
        </CircularProgress>
        <Typography type="body-sm" className="text-muted">
          {scheduled === 0
            ? "No scheduled habits in the last 30 days"
            : `${completed} of ${scheduled} scheduled check-ins`}
        </Typography>
      </View>

      <View
        className="rounded-2xl bg-accent/10 px-3.5 py-3"
        style={{ borderCurve: "continuous" }}
      >
        <Typography type="body-sm" className="text-center text-foreground">
          {momentumCopy(percent)}
        </Typography>
      </View>
    </View>
  );
}
