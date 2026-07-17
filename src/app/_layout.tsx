import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Uniwind, useCSSVariable } from "uniwind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HeroUINativeProvider } from "heroui-native";

import { AppProviders } from "@/providers/app-providers";
import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if splash was already hidden.
});

export default function RootLayout() {
  const colorScheme = useAppColorScheme();
  const backgroundColor = useCSSVariable("--color-background");
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  useEffect(() => {
    // Follow the device color scheme by default (Uniwind adaptive themes).
    Uniwind.setTheme("system");
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Ignore if splash was already hidden.
    });
  }, []);

  useEffect(() => {
    if (typeof backgroundColor === "string") {
      void SystemUI.setBackgroundColorAsync(backgroundColor);
    }
  }, [backgroundColor]);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor:
          typeof backgroundColor === "string" ? backgroundColor : undefined,
      }}
    >
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <AppProviders>
            <StatusBar style={statusBarStyle} animated />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { flex: 1 },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </AppProviders>
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
