import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

/** Soft Health-like mesh — peach / lavender / sky. */
const LIGHT_COLORS = ["#FFD0C0", "#C8B6E8", "#A8D0F0"] as const;
const DARK_COLORS = ["#6B453C", "#4A3F68", "#2F4A5E"] as const;

/** Hex only — matches theme surfaces without oklch() (unreliable in RN styles/SVG). */
const LIGHT_BG = "#F7F7F7";
const DARK_BG = "#121214";

/**
 * Cross-platform SVG radial glow. Full-screen solid base so the page never
 * shows a mismatched grey band under the mesh.
 */
export default function MeshBackground() {
  const { height, width } = useWindowDimensions();
  const scheme = useAppColorScheme();
  const background = scheme === "dark" ? DARK_BG : LIGHT_BG;
  const meshHeight = height * 0.72;
  const colors = scheme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width,
        zIndex: 0,
        backgroundColor: background,
      }}
    >
      <View style={{ height: meshHeight, width, overflow: "hidden" }}>
        <Svg width={width} height={meshHeight} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="todayPeach" cx="10%" cy="-5%" rx="58%" ry="78%">
              <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.95" />
              <Stop offset="55%" stopColor={colors[0]} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="todayLavender"
              cx="48%"
              cy="5%"
              rx="52%"
              ry="82%"
            >
              <Stop offset="0%" stopColor={colors[1]} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={colors[1]} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={colors[1]} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="todaySky" cx="92%" cy="-5%" rx="58%" ry="78%">
              <Stop offset="0%" stopColor={colors[2]} stopOpacity="0.95" />
              <Stop offset="55%" stopColor={colors[2]} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={colors[2]} stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="todayFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={background} stopOpacity="0" />
              <Stop offset="45%" stopColor={background} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={width}
            height={meshHeight}
            fill={background}
          />
          <Rect
            x={0}
            y={0}
            width={width}
            height={meshHeight}
            fill="url(#todayPeach)"
          />
          <Rect
            x={0}
            y={0}
            width={width}
            height={meshHeight}
            fill="url(#todayLavender)"
          />
          <Rect
            x={0}
            y={0}
            width={width}
            height={meshHeight}
            fill="url(#todaySky)"
          />
          <Rect
            x={0}
            y={0}
            width={width}
            height={meshHeight}
            fill="url(#todayFade)"
          />
        </Svg>
      </View>
    </View>
  );
}
