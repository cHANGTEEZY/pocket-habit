import { View } from "react-native";

import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import ProfileButton from "@/components/ProfileButton";

import MeshBackground from "@/components/MeshBackground";
import TodaysProgress from "./components/TodaysProgress";
import WeeklyInsight from "./components/WeeklyInsight";
import { getGreeting } from "./lib/greeting";

export default function Today() {
  const greeting = getGreeting();

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title={greeting}
        trailing={<ProfileButton />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="mb-3 mt-3">
          <TodaysProgress />
        </View>
        <View className="mb-3">
          <WeeklyInsight />
        </View>
      </CollapsingLargeHeader>
    </View>
  );
}
