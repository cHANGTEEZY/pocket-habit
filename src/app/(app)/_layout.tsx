import { ActivityIndicator, View, useColorScheme } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "@/lib/auth-client";

export default function AppLayout() {
  const { data: session, isPending } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          flex: 1,
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
        },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
