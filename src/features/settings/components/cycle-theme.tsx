import { type ComponentProps } from "react";
import { View } from "react-native";
import { useCSSVariable, useUniwind } from "uniwind";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Typography } from "heroui-native/text";

import { PressableFeedback } from "heroui-native";
import {
  type AppearancePreference,
  resolveAppearancePreference,
  setAppearance,
} from "../lib/appearance";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

const OPTIONS: AppearancePreference[] = ["system", "dark", "light"];

const LABELS: Record<AppearancePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function SystemThemeIcon({
  color,
  size = 28,
}: {
  color: string;
  size?: number;
}) {
  const half = size / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        borderWidth: 1,
        borderColor: color,
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <View style={{ width: half, height: size, backgroundColor: color }} />
      <View
        style={{ width: half, height: size, backgroundColor: "transparent" }}
      />
    </View>
  );
}

function ThemeGlyph({
  preference,
  color,
}: {
  preference: AppearancePreference;
  color: string;
}) {
  if (preference === "system") {
    return <SystemThemeIcon color={color} />;
  }

  const icon: IconData = preference === "light" ? Sun03Icon : Moon02Icon;

  return (
    <HugeiconsIcon icon={icon} size={28} color={color} strokeWidth={1.75} />
  );
}

export default function CycleTheme() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const selected = resolveAppearancePreference(theme, hasAdaptiveThemes);

  const foreground = useCSSVariable("--color-foreground");
  const muted = useCSSVariable("--color-muted");
  const border = useCSSVariable("--color-border");

  const selectedColor = typeof foreground === "string" ? foreground : "#FFFFFF";
  const idleColor = typeof muted === "string" ? muted : "#8A8A8F";
  const idleBorder = typeof border === "string" ? border : "#3A3A3C";

  return (
    <View className="mt-5 flex-row gap-3">
      {OPTIONS.map((option) => {
        const isSelected = selected === option;
        const accent = isSelected ? selectedColor : idleColor;

        return (
          <PressableFeedback
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${LABELS[option]} color scheme`}
            onPress={() => setAppearance(option)}
            className="min-h-[110px] flex-1 justify-between rounded-xl px-3.5 py-3.5"
            style={{
              borderCurve: "continuous",
              borderWidth: isSelected ? 1.5 : 1,
              borderColor: isSelected ? selectedColor : idleBorder,
            }}
          >
            <ThemeGlyph preference={option} color={accent} />
            <Typography
              type="body-sm"
              weight="semibold"
              style={{ color: accent }}
            >
              {LABELS[option]}
            </Typography>
            <PressableFeedback.Ripple
              animation={{
                backgroundColor: { value: accent },
                opacity: { value: [0.2, 0.2, 0] },
                progress: { baseDuration: 200 },
              }}
            />
          </PressableFeedback>
        );
      })}
    </View>
  );
}
