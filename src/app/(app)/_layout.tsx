import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

import { useAuth } from "@/api/hooks/use-auth";

export default function AppLayout() {
  const { session, isPending } = useAuth();
  const backgroundColor = useCSSVariable("--color-background");

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            typeof backgroundColor === "string" ? backgroundColor : undefined,
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
          backgroundColor:
            typeof backgroundColor === "string" ? backgroundColor : undefined,
        },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
