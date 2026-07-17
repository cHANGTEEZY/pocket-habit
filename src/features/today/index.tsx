import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Container from "@/components/layouts/Container";

import AddFirstHabit from "./components/AddFirstHabit";
import TodayHeader from "./components/TodayHeader";
import TodayMeshBackground from "./components/TodayMeshBackground";

export default function Today() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ marginTop: -insets.top }}>
      <TodayMeshBackground />
      <Container style={{ paddingTop: insets.top + 8, zIndex: 1 }}>
        <TodayHeader />
        <View>
          <AddFirstHabit />
        </View>
      </Container>
    </View>
  );
}
