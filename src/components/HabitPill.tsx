import type { ReactNode } from "react";
import {
  type AccessibilityRole,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useCSSVariable } from "uniwind";

import { PressableFeedback } from "heroui-native";

import HapticPressable, {
  type HapticConfig,
} from "@/components/HapticButton";

const ROW_CLASS_NAME =
  "flex-row items-center gap-3.5 overflow-hidden rounded-4xl bg-surface px-3.5 py-3";

const ROW_STYLE = {
  borderCurve: "continuous" as const,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
  overflow: "hidden" as const,
};

type HabitPillSlotProps = {
  children: ReactNode;
};

function HabitPillLeading({ children }: HabitPillSlotProps) {
  return <View className="shrink-0">{children}</View>;
}

function HabitPillBody({ children }: HabitPillSlotProps) {
  return <View className="min-w-0 flex-1 gap-0.5">{children}</View>;
}

function HabitPillTrailing({ children }: HabitPillSlotProps) {
  return <View className="shrink-0">{children}</View>;
}

export type HabitPillProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  haptic?: HapticConfig;
  className?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: {
    checked?: boolean;
    selected?: boolean;
    disabled?: boolean;
  };
};

function HabitPillRoot({
  children,
  onPress,
  disabled,
  haptic = { type: "selection" },
  className,
  style,
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
}: HabitPillProps) {
  const muted = useCSSVariable("--color-muted");

  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";
  const rippleColor = mutedColor;

  if (!onPress) {
    return (
      <View
        className={className}
        style={style}
        accessibilityRole={accessibilityRole ?? "summary"}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
      >
        <View className={ROW_CLASS_NAME} style={ROW_STYLE}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <PressableFeedback
      asChild
      animation={false}
      isDisabled={disabled}
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onPress={onPress}
    >
      <HapticPressable
        disabled={disabled}
        haptic={haptic}
        hapticTrigger="onPressIn"
        className={[ROW_CLASS_NAME, className].filter(Boolean).join(" ")}
        style={[ROW_STYLE, style]}
      >
        <PressableFeedback.Scale className="flex-1 flex-row items-center gap-3.5">
          {children}
        </PressableFeedback.Scale>
        <PressableFeedback.Ripple
          animation={{
            backgroundColor: { value: rippleColor },
            opacity: { value: [0.12, 0.12, 0] },
            progress: { baseDuration: 200 },
          }}
        />
      </HapticPressable>
    </PressableFeedback>
  );
}

const HabitPill = Object.assign(HabitPillRoot, {
  Leading: HabitPillLeading,
  Body: HabitPillBody,
  Trailing: HabitPillTrailing,
});

export default HabitPill;
