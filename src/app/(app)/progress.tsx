import { Text, View } from "react-native";

import Screen from "@/components/layouts/Screen";

export default function ProgressScreen() {
  return (
    <Screen edges={["left", "right", "top"]}>
      <View className="px-4 py-6">
        <Text>progress</Text>
      </View>
    </Screen>
  );
}
