import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { ActivityIndicator, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { useAuth } from "@/api/hooks/use-auth";

export default function AppLayout() {
  const { session, isPending } = useAuth();
  const backgroundColor = useCSSVariable("--color-background");
  const accentColor = useCSSVariable("--color-accent");
  const mutedColor = useCSSVariable("--color-muted");

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
    <NativeTabs
      tintColor={typeof accentColor === "string" ? accentColor : undefined}
      iconColor={
        typeof mutedColor === "string"
          ? { default: mutedColor, selected: accentColor as string }
          : undefined
      }
      labelStyle={
        typeof mutedColor === "string"
          ? {
              default: { color: mutedColor },
              selected: {
                color:
                  typeof accentColor === "string" ? accentColor : mutedColor,
              },
            }
          : undefined
      }
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="today">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "sun.max", selected: "sun.max.fill" }}
          md={{ default: "today", selected: "calendar_today" }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="habits">
        <NativeTabs.Trigger.Label>Habits</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "list.bullet.clipboard",
            selected: "list.bullet.clipboard.fill",
          }}
          md={{ default: "checklist", selected: "checklist" }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          md={{ default: "bar_chart", selected: "bar_chart" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
