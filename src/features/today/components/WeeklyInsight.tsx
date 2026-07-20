import { ChartBarIncreasingIcon } from "@hugeicons/core-free-icons";
import { useCSSVariable } from "uniwind";

import StatCard from "./StatCard";
import WeeklyBars, { type WeeklyBar } from "./WeeklyBars";

const ACCENT = "#f5a524";

const WEEK_BARS: WeeklyBar[] = [
  { value: 0.45 },
  { value: 0.28 },
  { value: 0.32 },
  { value: 0.7 },
  { value: 0.38 },
  { value: 0.92 },
  { value: 0.55, active: true },
];

const WeeklyInsight = () => {
  const border = useCSSVariable("--color-border");
  const inactiveColor = typeof border === "string" ? border : "#e5e5ea";
  const daysCompleted = WEEK_BARS.filter((bar) => bar.value >= 0.5).length;

  return (
    <StatCard
      title="Week"
      icon={ChartBarIncreasingIcon}
      accentColor={ACCENT}
      value={daysCompleted}
      unit="of 7 days"
      accessibilityLabel={`${daysCompleted} of 7 days with solid habit completion`}
      graphic={
        <WeeklyBars
          bars={WEEK_BARS}
          activeColor={ACCENT}
          inactiveColor={inactiveColor}
        />
      }
    />
  );
};

export default WeeklyInsight;
