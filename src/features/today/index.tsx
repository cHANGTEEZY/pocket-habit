import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ProfileButton from "@/components/ProfileButton";
import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

import { Typography } from "heroui-native/text";

import MeshBackground from "../../components/MeshBackground";
import TodaysProgress from "./components/TodaysProgress";
import WeeklyInsight from "./components/WeeklyInsight";
import { getGreeting } from "./lib/greeting";

const COLLAPSE_DISTANCE = 56;
const COMPACT_BAR_CONTENT_HEIGHT = 44;

type WidgetId = "progress" | "weekly";

type WidgetItem = {
  key: WidgetId;
};

const INITIAL_WIDGETS: WidgetItem[] = [
  { key: "progress" },
  { key: "weekly" },
];

function WidgetCard({ id }: { id: WidgetId }) {
  switch (id) {
    case "progress":
      return <TodaysProgress />;
    case "weekly":
      return <WeeklyInsight />;
  }
}

export default function Today() {
  const greeting = getGreeting();
  const insets = useSafeAreaInsets();
  const scheme = useAppColorScheme();
  const scrollY = useSharedValue(0);
  const lastPlaceholderIndex = useRef<number | null>(null);
  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  const compactBarHeight = insets.top + COMPACT_BAR_CONTENT_HEIGHT;

  const largeTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE * 0.7],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, COLLAPSE_DISTANCE],
          [0, -10],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const compactChromeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.35, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<WidgetItem>) => (
      <ScaleDecorator activeScale={0.96}>
        <Pressable
          onLongPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            drag();
          }}
          disabled={isActive}
          delayLongPress={200}
          accessibilityHint="Long press to reorder"
          style={styles.item}
        >
          <WidgetCard id={item.key} />
        </Pressable>
      </ScaleDecorator>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />

      <View
        pointerEvents="box-none"
        style={[styles.sticky, { height: compactBarHeight }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, compactChromeStyle]}
        >
          <BlurView
            intensity={scheme === "dark" ? 20 : 28}
            tint={scheme === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={{ paddingTop: insets.top }} pointerEvents="none">
          <View style={styles.compactRow}>
            <Animated.View
              style={[styles.compactTitleWrap, compactChromeStyle]}
            >
              <Typography
                type="h4"
                weight="semibold"
                className="text-foreground"
                align="center"
                truncate
              >
                {greeting}
              </Typography>
            </Animated.View>
          </View>
        </View>
      </View>

      <DraggableFlatList
        data={widgets}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        activationDistance={8}
        dragItemOverflow
        onScrollOffsetChange={(offset) => {
          // eslint-disable-next-line react-hooks/immutability -- reanimated shared value
          scrollY.value = offset;
        }}
        onPlaceholderIndexChange={(index) => {
          const prev = lastPlaceholderIndex.current;
          if (prev !== null && index !== prev && index >= 0) {
            void Haptics.selectionAsync();
          }
          lastPlaceholderIndex.current = index;
        }}
        onDragEnd={({ data, from, to }) => {
          lastPlaceholderIndex.current = null;
          setWidgets(data);
          if (from !== to) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 8,
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={
          <Animated.View style={[styles.expandedRow, largeTitleStyle]}>
            <View style={styles.largeTitleWrap}>
              <Typography
                type="h1"
                weight="semibold"
                className="text-foreground"
                accessibilityRole="header"
              >
                {greeting}
              </Typography>
            </View>
            <View style={styles.trailingSlot}>
              <ProfileButton />
            </View>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sticky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  compactRow: {
    height: COMPACT_BAR_CONTENT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  compactTitleWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  expandedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    minHeight: COMPACT_BAR_CONTENT_HEIGHT,
  },
  largeTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  trailingSlot: {
    marginLeft: 8,
  },
  item: {
    marginBottom: 12,
  },
});
