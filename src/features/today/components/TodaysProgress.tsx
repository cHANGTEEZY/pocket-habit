import { CalendarSyncIcon } from "@hugeicons/core-free-icons";

import CircularProgress from "@/components/CircularProgress";

import StatCard from "./StatCard";

const ACCENT = "#63e065";
const TRACK = "#e5e5ea";

const TodaysProgress = () => {
  const completedTasks = 5 as number;
  const totalTasks = 10 as number;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <StatCard
      title="Habits"
      icon={CalendarSyncIcon}
      accentColor={ACCENT}
      value={completedTasks}
      unit={`of ${totalTasks} completed`}
      accessibilityLabel={`${completedTasks} of ${totalTasks} habits completed`}
      graphic={
        <CircularProgress
          value={progress}
          progressColor={ACCENT}
          trackColor={TRACK}
          accessibilityLabel={`${completedTasks} of ${totalTasks} habits completed`}
        />
      }
    />
  );
};

export default TodaysProgress;
