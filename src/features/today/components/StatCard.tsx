import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";

import { HugeiconsIcon } from "@hugeicons/react-native";
import { Card, PressableFeedback, Typography } from "heroui-native";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

export type StatCardProps = {
  title: string;
  icon: IconData;
  accentColor: string;
  value: string | number;
  unit: string;
  graphic: ReactNode;
  trailing?: ReactNode;
  accessibilityLabel?: string;
  className?: string;
  onPress?: () => void;
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
  onPress,
}: StatCardProps) {
  return (
    <PressableFeedback
      onPress={onPress ?? undefined}
      isDisabled={onPress === undefined}
    >
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
    </PressableFeedback>
  );
}
