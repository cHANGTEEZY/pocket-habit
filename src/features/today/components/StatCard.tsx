import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";

import { HugeiconsIcon } from "@hugeicons/react-native";
import { Card, Typography } from "heroui-native";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

export type StatCardProps = {
  title: string;
  icon: IconData;
  /** Accent used for the title and icon */
  accentColor: string;
  /** Large primary metric */
  value: string | number;
  /** Label beside the metric, e.g. "of 10 completed" */
  unit: string;
  /** Right-side visualization (circle, bars, etc.) */
  graphic: ReactNode;
  /** Optional top-right content (percent, time, chevron) */
  trailing?: ReactNode;
  accessibilityLabel?: string;
  className?: string;
};

export default function StatCard({
  title,
  icon,
  accentColor,
  value,
  unit,
  graphic,
  trailing,
  accessibilityLabel,
  className,
}: StatCardProps) {
  return (
    <Card
      className={`w-full rounded-4xl ${className ?? ""}`}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
    >
      <Card.Body className="gap-6 py-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <HugeiconsIcon
              icon={icon}
              size={24}
              color={accentColor}
              strokeWidth={1.75}
            />
            <Typography
              type="h5"
              weight="semibold"
              style={{ color: accentColor }}
            >
              {title}
            </Typography>
          </View>
          {trailing}
        </View>

        <View className="flex-row items-end justify-between">
          <View className="flex-row items-baseline gap-1.5">
            <Typography type="h2" weight="semibold">
              {value}
            </Typography>
            <Typography type="body-sm" className="text-muted">
              {unit}
            </Typography>
          </View>
          {graphic}
        </View>
      </Card.Body>
    </Card>
  );
}
