import CircularProgress from "@/components/CircularProgress";
import { Typography } from "heroui-native/text";

/** Shared ring size for progress summary cards (Today, Consistency). */
export const PERCENT_RING_SIZE = 120;
export const PERCENT_RING_STROKE = 10;

export type PercentRingProps = {
  /** Progress from 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  accessibilityLabel?: string;
  className?: string;
};

export default function PercentRing({
  value,
  size = PERCENT_RING_SIZE,
  strokeWidth = PERCENT_RING_STROKE,
  progressColor,
  accessibilityLabel,
  className,
}: PercentRingProps) {
  return (
    <CircularProgress
      value={value}
      size={size}
      strokeWidth={strokeWidth}
      progressColor={progressColor}
      accessibilityLabel={accessibilityLabel}
      className={className ?? "self-center"}
    >
      <Typography type="h2" weight="semibold" className="text-foreground">
        {value}%
      </Typography>
    </CircularProgress>
  );
}
