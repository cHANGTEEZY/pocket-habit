import { View } from "react-native";

export type WeeklyBar = {
  value: number;

  active?: boolean;
};

type WeeklyBarsProps = {
  bars: WeeklyBar[];

  activeColor: string;

  inactiveColor: string;
  height?: number;
  barWidth?: number;
  gap?: number;
};

export default function WeeklyBars({
  bars,
  activeColor,
  inactiveColor,
  height = 48,
  barWidth = 6,
  gap = 5,
}: WeeklyBarsProps) {
  return (
    <View
      className="flex-row items-end"
      style={{ height, gap }}
      accessibilityRole="image"
      accessibilityLabel="Weekly habit completion chart"
    >
      {bars.map((bar, index) => {
        const clamped = Math.min(1, Math.max(0, bar.value));
        const barHeight = Math.max(height * 0.12, height * clamped);

        return (
          <View
            key={index}
            style={{
              width: barWidth,
              height: barHeight,
              borderRadius: barWidth,
              backgroundColor: bar.active ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
}
