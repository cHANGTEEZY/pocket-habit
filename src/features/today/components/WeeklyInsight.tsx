import { ChartBarIncreasingIcon } from "@hugeicons/core-free-icons";
import { useMemo } from "react";
import { useCSSVariable } from "uniwind";

import { toDateKey, useHabitLogsInRange, useHabits } from "@/api";
import { addDays, startOfLocalDay } from "@/features/progress/lib/schedule";
import { computeProgressStats } from "@/features/progress/lib/stats";

import StatCard from "./StatCard";
import WeeklyBars, { type WeeklyBar } from "./WeeklyBars";

const WeeklyInsight = () => {
  const border = useCSSVariable("--color-border");
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

  const daysWithProgress = stats.weekDays.filter(
    (day) => day.completed > 0,
  ).length;

  return (
    <StatCard
      title="Week"
      icon={ChartBarIncreasingIcon}
      accentColor={"#db6237"}
      value={daysWithProgress}
      unit="of 7 days"
      accessibilityLabel={`${daysWithProgress} of 7 days with at least one habit completed`}
      graphic={
        <WeeklyBars
          bars={bars}
          activeColor={"#db6237"}
          inactiveColor={inactiveColor}
        />
      }
    />
  );
};

export default WeeklyInsight;
