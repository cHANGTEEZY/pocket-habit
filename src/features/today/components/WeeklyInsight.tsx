import { ChartBarIncreasingIcon } from "@hugeicons/core-free-icons";
import { useMemo } from "react";
import { useCSSVariable } from "uniwind";

import {
  toDateKey,
  useHabitLogsInRange,
  useHabits,
} from "@/api";
import { addDays, startOfLocalDay } from "@/features/progress/lib/schedule";
import { computeProgressStats } from "@/features/progress/lib/stats";

import StatCard from "./StatCard";
import WeeklyBars, { type WeeklyBar } from "./WeeklyBars";

const WeeklyInsight = () => {
  const accent = useCSSVariable("--color-accent");
  const border = useCSSVariable("--color-border");
  const accentColor = typeof accent === "string" ? accent : "#007AFF";
  const inactiveColor = typeof border === "string" ? border : "#e5e5ea";

  const range = useMemo(() => {
    const today = startOfLocalDay(new Date());
    // Cover Mon–Sun of current week (up to 6 days back from today is enough
    // mid-week; use 6 + weekday offset safely with 13 days).
    return {
      from: toDateKey(addDays(today, -13)),
      to: toDateKey(today),
    };
  }, []);

  const { data: habits = [] } = useHabits({
    status: "active",
    routine: "all",
  });
  const { data: logs = [] } = useHabitLogsInRange(range.from, range.to);

  const stats = useMemo(
    () => computeProgressStats(habits, logs),
    [habits, logs],
  );

  const todayKey = toDateKey(new Date());
  const bars: WeeklyBar[] = stats.weekDays.map((day) => ({
    value: day.scheduled === 0 ? 0.12 : Math.max(0.12, day.rate),
    active: day.dateKey === todayKey,
  }));

  const daysCompleted = stats.weekDays.filter(
    (day) => day.status === "done",
  ).length;

  return (
    <StatCard
      title="Week"
      icon={ChartBarIncreasingIcon}
      accentColor={accentColor}
      value={daysCompleted}
      unit="of 7 days"
      accessibilityLabel={`${daysCompleted} of 7 days with full habit completion`}
      graphic={
        <WeeklyBars
          bars={bars}
          activeColor={accentColor}
          inactiveColor={inactiveColor}
        />
      }
    />
  );
};

export default WeeklyInsight;
