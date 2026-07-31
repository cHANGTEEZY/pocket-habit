import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";
import { AppProviders } from "@/providers/app-providers";

// Keep the native splash up until the root tree has painted — avoids a
// second "fake splash" flash while JS boots.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if splash was already hidden.
});

export default function RootLayout() {
  const colorScheme = useAppColorScheme();
  const backgroundColor = useCSSVariable("--color-background");
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  useEffect(() => {
    // Wait one frame so the first screen background matches the splash.
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {
        // Ignore if splash was already hidden.
      });
    });
    return () => cancelAnimationFrame(frame);
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
                contentStyle: {
                  flex: 1,
                  backgroundColor:
                    typeof backgroundColor === "string"
                      ? backgroundColor
                      : undefined,
                },
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
