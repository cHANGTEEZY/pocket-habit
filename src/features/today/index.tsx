import { View } from "react-native";

import { useTodayHabits } from "@/api";
import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";
import { Typography } from "heroui-native/text";

import { router } from "expo-router";
import TodayHabitsList from "./components/TodayHabitsList";
import TodaySkeleton from "./components/TodaySkeleton";
import TodaysProgress from "./components/TodaysProgress";
import WeeklyInsight from "./components/WeeklyInsight";
import { getGreeting } from "./lib/greeting";

export default function Today() {
  const greeting = getGreeting();
  const { data: habits = [], isPending, isError, error } = useTodayHabits();

  return (
    <View collapsable={false} className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title={greeting}
        trailing={
          <ProfileButton
            onPress={() => router.navigate("/(screens)/settings")}
            size="sm"
            color="accent"
            variant="default"
          />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isPending ? (
          <TodaySkeleton />
        ) : (
          <>
            <View className="mb-3 mt-3 px-4">
              <TodaysProgress />
            </View>
            <View className="mb-3 px-4">
              <WeeklyInsight />
            </View>

            <View className="mb-8 mt-5 gap-3 px-4">
              {isError ? (
                <Typography type="body-sm" className="px-1 text-danger">
                  {error?.message ?? "Couldn&apos;t load habits."}
                </Typography>
              ) : (
                <TodayHabitsList habits={habits} />
              )}
            </View>
          </>
        )}
      </CollapsingLargeHeader>
    </View>
  );
}
