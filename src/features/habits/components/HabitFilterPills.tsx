import type { ComponentProps } from "react";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import HapticPressable from "@/components/HapticButton";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { PressableFeedback } from "heroui-native";
import { Typography } from "heroui-native/text";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

type HabitFilterPillsProps = {
  iconName: IconData;
  iconSize?: number;
  text: string;
  isSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

const HabitFilterPills = ({
  iconName,
  iconSize = 16,
  text,
  isSelected = false,
  onSelectedChange,
}: HabitFilterPillsProps) => {
  const accent = useCSSVariable("--color-accent");
  const accentForeground = useCSSVariable("--color-accent-foreground");
  const muted = useCSSVariable("--color-muted");

  const accentColor = typeof accent === "string" ? accent : "#007AFF";
  const accentTextColor =
    typeof accentForeground === "string" ? accentForeground : "#FFFFFF";
  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";

  const iconColor = isSelected ? accentTextColor : mutedColor;
  const rippleColor = isSelected ? accentTextColor : accentColor;

  return (
    <PressableFeedback
      asChild
      animation={false}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={text}
      onPress={() => onSelectedChange?.(true)}
    >
      <HapticPressable
        haptic={{ type: "selection" }}
        hapticTrigger="onPressIn"
        className={`h-9 shrink-0 flex-row items-center gap-1.5 rounded-full px-3 ${
          isSelected ? "bg-accent" : "border border-border bg-surface-secondary"
        }`}
        style={{ borderCurve: "continuous" }}
      >
        <PressableFeedback.Scale>
          <View className="flex-row items-center gap-1.5">
            <HugeiconsIcon
              icon={iconName}
              size={iconSize}
              color={iconColor}
              strokeWidth={1.75}
            />
            <Typography
              type="body-sm"
              weight="semibold"
              className={isSelected ? "text-accent-foreground" : "text-muted"}
            >
              {text}
            </Typography>
          </View>
        </PressableFeedback.Scale>
        <PressableFeedback.Ripple
          animation={{
            backgroundColor: { value: rippleColor },
            opacity: { value: [0.18, 0.18, 0] },
            progress: { baseDuration: 200 },
          }}
        />
      </HapticPressable>
    </PressableFeedback>
  );
};

export default HabitFilterPills;
