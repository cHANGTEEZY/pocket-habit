import { useWindowDimensions, View } from "react-native";

import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";

import AddFirstHabit from "./components/AddFirstHabit";
import TodayMeshBackground from "./components/TodayMeshBackground";
import TodayProfileButton from "./components/TodayProfileButton";
import { getGreeting } from "./lib/greeting";

export default function Today() {
  const greeting = getGreeting();
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1 bg-background">
      <TodayMeshBackground />
      <CollapsingLargeHeader
        title={greeting}
        trailing={<TodayProfileButton />}
        contentContainerStyle={{ minHeight: height + 160 }}
      >
        <View className="px-4">
          <AddFirstHabit />
        </View>
      </CollapsingLargeHeader>
    </View>
  );
}
