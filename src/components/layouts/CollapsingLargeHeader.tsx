import { BlurTargetView, BlurView } from "expo-blur";
import { type ReactNode, useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

import { Typography } from "heroui-native/text";

const COLLAPSE_DISTANCE = 56;
const COMPACT_BAR_CONTENT_HEIGHT = 44;

/** Android SDK 55+: real blur requires BlurTargetView + dimezis method. */
const ANDROID_BLUR_METHOD = "dimezisBlurView" as const;

type CollapsingLargeHeaderProps = {
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
};

export default function CollapsingLargeHeader({
  title,
  trailing,
  children,
  contentContainerStyle,
}: CollapsingLargeHeaderProps) {
  const insets = useSafeAreaInsets();
  const scheme = useAppColorScheme();
  const scrollY = useSharedValue(0);
  const blurTargetRef = useRef<View | null>(null);

  const compactBarHeight = insets.top + COMPACT_BAR_CONTENT_HEIGHT;
  const isDark = scheme === "dark";

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  return (
    <View style={styles.root}>
      {/* Content first so Android BlurView can sample updates (expo-blur known issue). */}
      <BlurTargetView ref={blurTargetRef} style={styles.scroll}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingTop: insets.top + 8,
              paddingBottom: 32,
            },
            contentContainerStyle,
          ]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.expandedRow, largeTitleStyle]}>
            <View style={styles.largeTitleWrap}>
              <Typography
                type="h1"
                weight="semibold"
                className="text-foreground"
                accessibilityRole="header"
              >
                {title}
              </Typography>
            </View>
            {trailing ? (
              <View style={styles.trailingSlot}>{trailing}</View>
            ) : null}
          </Animated.View>

          {children}
        </Animated.ScrollView>
      </BlurTargetView>

      <View
        pointerEvents="box-none"
        style={[styles.sticky, { height: compactBarHeight }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, compactChromeStyle]}
        >
          <BlurView
            intensity={isDark ? 18 : 24}
            tint={
              Platform.OS === "ios"
                ? isDark
                  ? "systemUltraThinMaterialDark"
                  : "systemUltraThinMaterialLight"
                : isDark
                  ? "dark"
                  : "light"
            }
            style={StyleSheet.absoluteFill}
            {...(Platform.OS === "android"
              ? {
                  blurTarget: blurTargetRef,
                  blurMethod: ANDROID_BLUR_METHOD,
                  // Higher = softer blur on Android (intensity is divided by this).
                  blurReductionFactor: 8,
                }
              : null)}
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
                {title}
              </Typography>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sticky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    overflow: "hidden",
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
  trailingSlot: {
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  expandedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
    minHeight: COMPACT_BAR_CONTENT_HEIGHT,
  },
  largeTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
});
