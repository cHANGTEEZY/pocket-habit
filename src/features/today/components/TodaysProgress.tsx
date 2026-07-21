import { CalendarSyncIcon, ChevronRightIcon } from "@hugeicons/core-free-icons";

import CircularProgress from "@/components/CircularProgress";

import { HugeiconsIcon } from "@hugeicons/react-native";
import { Typography } from "heroui-native";
import { ColorValue, View } from "react-native";
import { useCSSVariable } from "uniwind";
import StatCard from "./StatCard";

const ACCENT = "#63e065";
const TRACK = "#e5e5ea";

const TodaysProgress = () => {
  const completedTasks = 5 as number;
  const totalTasks = 10 as number;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const lastCompletedTaskTime = "19:30";
  const muted = useCSSVariable("--color-muted");
  const mutedColor =
    typeof muted === "string" ? (muted as ColorValue) : undefined;

  return (
    <StatCard
      title="Habits"
      trailing={
        <View className="flex-row items-center gap-1">
          <Typography type="body-xs" weight="medium" color="muted">
            {lastCompletedTaskTime}
          </Typography>
          <HugeiconsIcon
            icon={ChevronRightIcon}
            size={16}
            color={(mutedColor as ColorValue) ?? "muted"}
          />
        </View>
      }
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
      onPress={() => {
        console.log("Pressed habits card");
      }}
    />
  );
};

export default TodaysProgress;
