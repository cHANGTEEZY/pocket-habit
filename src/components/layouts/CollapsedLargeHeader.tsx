import { BlurView } from "expo-blur";
import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

import { Typography } from "heroui-native/text";

const BAR_CONTENT_HEIGHT = 44;
const SIDE_INSET = 56;

type CollapsedLargeHeaderProps = {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
};

export default function CollapsedLargeHeader({
  title,
  leading,
  trailing,
  children,
  contentContainerStyle,
}: CollapsedLargeHeaderProps) {
  const insets = useSafeAreaInsets();
  const scheme = useAppColorScheme();
  const barHeight = insets.top + BAR_CONTENT_HEIGHT;

  return (
    <View style={styles.root}>
      <View style={[styles.sticky, { height: barHeight }]}>
        <BlurView
          intensity={scheme === "dark" ? 20 : 28}
          tint={scheme === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />

        <View style={{ paddingTop: insets.top }}>
          <View style={styles.bar}>
            <View style={styles.titleLayer} pointerEvents="none">
              <Typography
                type="h4"
                weight="semibold"
                className="text-center text-foreground"
                truncate
                accessibilityRole="header"
                style={styles.titleText}
              >
                {title}
              </Typography>
            </View>

            <View style={styles.controlsRow} pointerEvents="box-none">
              <View style={styles.sideSlot} pointerEvents="box-none">
                {leading}
              </View>
              <View
                style={[styles.sideSlot, styles.trailingSlot]}
                pointerEvents="box-none"
              >
                {trailing}
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingTop: barHeight + 8,
            paddingBottom: 32,
          },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
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
  bar: {
    height: BAR_CONTENT_HEIGHT,
    justifyContent: "center",
  },
  titleLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIDE_INSET,
  },
  titleText: {
    width: "100%",
    textAlign: "center",
  },
  controlsRow: {
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  sideSlot: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  trailingSlot: {
    alignItems: "flex-end",
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
