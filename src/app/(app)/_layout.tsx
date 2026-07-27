import { Redirect, router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { useAuth } from "@/api/hooks/use-auth";
import { useAppColorScheme } from "@/hooks/use-app-color-scheme";
import {
  GlassTabBar,
  GlassTabButton,
  renderFadingTabScreen,
  TabBarMinimizeProvider,
  type GlassTabItem,
} from "expo-glass-tabs";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";

const TAB_ITEMS: (GlassTabItem & { href: string })[] = [
  { name: "today", href: "/today", label: "Today", icon: "sun.max" },
  {
    name: "habits",
    href: "/habits",
    label: "Habits",
    icon: "list.bullet.clipboard",
  },
  { name: "progress", href: "/progress", label: "Progress", icon: "chart.bar" },
];

export default function AppLayout() {
  const { session, isPending } = useAuth();
  const backgroundColor = useCSSVariable("--color-background");
  const scheme = useAppColorScheme();
  const resolvedBackground =
    typeof backgroundColor === "string"
      ? backgroundColor
      : scheme === "dark"
        ? "#121214"
        : "#F7F7F7";
  // Floating pill stays dark (Revolut-style); edge fade is scheme-aware in ProgressiveBlur.
  const glassTheme = {
    activeTint: "#FFFFFF",
    inactiveTint: "#9E9EA6",
    highlight: "rgba(255,255,255,0.14)",
    glassTint: "rgba(10,10,12,0.55)",
    solidFallback: "rgba(18,18,20,0.94)",
  };

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: resolvedBackground,
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
    <TabBarMinimizeProvider>
      <View style={{ flex: 1, backgroundColor: resolvedBackground }}>
        <Tabs>
          <TabSlot
            style={{ height: "100%", backgroundColor: resolvedBackground }}
            renderFn={renderFadingTabScreen}
          />
          <TabList asChild>
            <GlassTabBar
              onIndexSelected={(i) =>
                router.navigate(TAB_ITEMS[i].href as never)
              }
              theme={glassTheme}
              edgeFadeScheme={scheme}
              haptics // scrub tick (iOS), default true
            >
              {TAB_ITEMS.map(({ href, ...item }, index) => (
                <TabTrigger
                  href={href as never}
                  name={item.name}
                  key={item.name}
                  asChild
                >
                  <GlassTabButton key={item.name} item={item} index={index} />
                </TabTrigger>
              ))}
            </GlassTabBar>
          </TabList>
        </Tabs>
      </View>
    </TabBarMinimizeProvider>
  );
}
