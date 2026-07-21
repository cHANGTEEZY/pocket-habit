import { View } from "react-native";

import { useTodayHabits } from "@/api";
import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";
import { Typography } from "heroui-native/text";

import TodayHabitsList from "./components/TodayHabitsList";
import TodaysProgress from "./components/TodaysProgress";
import WeeklyInsight from "./components/WeeklyInsight";
import { getGreeting } from "./lib/greeting";

export default function Today() {
  const greeting = getGreeting();
  const { data: habits = [], isPending, isError, error } = useTodayHabits();

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title={greeting}
        trailing={<ProfileButton />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      >
        <View className="mb-3 mt-3">
          <TodaysProgress />
        </View>
        <View className="mb-3">
          <WeeklyInsight />
        </View>

        <View className="mb-8 mt-5 gap-3">
          {isPending ? (
            <Typography type="body-sm" color="muted" className="px-1">
              Loading today’s habits…
            </Typography>
          ) : isError ? (
            <Typography type="body-sm" className="px-1 text-danger">
              {error?.message ?? "Couldn’t load habits."}
            </Typography>
          ) : (
            <TodayHabitsList habits={habits} />
          )}
        </View>
      </CollapsingLargeHeader>
    </View>
  );
}
