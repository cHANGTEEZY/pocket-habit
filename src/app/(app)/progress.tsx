import { useMinimizeOnScroll } from "expo-glass-tabs";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import Screen from "@/components/layouts/Screen";

export default function ProgressScreen() {
  const onScroll = useMinimizeOnScroll();
  const backgroundColor = useCSSVariable("--color-background");

  return (
    <Screen edges={["left", "right", "top"]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor:
            typeof backgroundColor === "string" ? backgroundColor : undefined,
        }}
      >
        <View className="px-4 py-6">
          <Text>progress</Text>
        </View>
      </Animated.ScrollView>
    </Screen>
  );
}
