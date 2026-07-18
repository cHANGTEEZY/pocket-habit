import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1 },
      }}
    >
      <Stack.Screen name="settings" />
      <Stack.Screen name="appearance" />
    </Stack>
  );
}
