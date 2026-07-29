import { Typography } from "heroui-native/text";

import PercentRing from "@/components/PercentRing";
import ProgressCard from "@/components/ProgressCard";

import { CARD_ACCENT } from "../lib/card-colors";

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
  const color = CARD_ACCENT.today;

  return (
    <ProgressCard
      leadingTitle="Today"
      accentColor={color}
      contentClassName="items-center gap-3"
      accessibilityLabel={`${completed} of ${total} habits completed today, ${percent} percent`}
    >
      <PercentRing
        value={percent}
        progressColor={color}
        accessibilityLabel={`${percent} percent complete today`}
      />
      <Typography type="body-sm" className="text-center text-muted">
        {total === 0
          ? "Nothing scheduled today"
          : `${completed} of ${total} done`}
      </Typography>
    </ProgressCard>
  );
}
