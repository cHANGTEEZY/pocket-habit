import { useWindowDimensions, View } from "react-native";

import EmptyComponent from "@/components/EmptyComponent";
import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import ProfileButton from "@/components/ProfileButton";

import { router } from "expo-router";
import MeshBackground from "../../components/MeshBackground";
import { getGreeting } from "./lib/greeting";

export default function Today() {
  const greeting = getGreeting();
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title={greeting}
        trailing={<ProfileButton />}
        contentContainerStyle={{ minHeight: height + 160 }}
      >
        <View className="px-4">
          <EmptyComponent
            title="Start your first habit"
            description="Add one small thing you want to do today. Checking in is enough to begin."
            actionLabel="Add habit"
            accessibilityLabel="No habits yet. Add your first habit to get started."
            onAction={() => {
              router.navigate({
                pathname: "/(app)/habits",
                params: { openAddHabitForm: "true" },
              });
            }}
          />
        </View>
      </CollapsingLargeHeader>
    </View>
  );
}
