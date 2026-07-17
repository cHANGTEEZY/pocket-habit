import { StyleSheet, useWindowDimensions, View } from "react-native";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

import { MeshGradientView } from "expo-mesh-gradient";
import { useCSSVariable } from "uniwind";

const LIGHT_TOP = ["#FFD0C0", "#C8B6E8", "#A8D0F0"] as const;
const LIGHT_MID = ["#FFE4DA", "#E4DCF5", "#D0E8F8"] as const;
const DARK_TOP = ["#6B453C", "#4A3F68", "#2F4A5E"] as const;
const DARK_MID = ["#4A322C", "#34304A", "#2A3844"] as const;

/** Mid-row dips so the color field curves down before dissolving. */
const MESH_POINTS: number[][] = [
  [0.0, 0.0],
  [0.5, 0.0],
  [1.0, 0.0],
  [0.0, 0.42],
  [0.5, 0.6],
  [1.0, 0.4],
  [0.0, 1.0],
  [0.5, 1.0],
  [1.0, 1.0],
];

/**
 * iOS: native mesh gradient for the top ~35% of the screen.
 */
export default function TodayMeshBackground() {
  const { height, width } = useWindowDimensions();
  const scheme = useAppColorScheme();
  const backgroundToken = useCSSVariable("--color-background");
  const background =
    typeof backgroundToken === "string"
      ? backgroundToken
      : scheme === "dark"
        ? "#1F1F22"
        : "#F7F7F7";

  const meshHeight = height * 0.35;
  const top = scheme === "dark" ? DARK_TOP : LIGHT_TOP;
  const mid = scheme === "dark" ? DARK_MID : LIGHT_MID;
  const colors = [...top, ...mid, background, background, background];

  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: meshHeight,
        width,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <MeshGradientView
        style={StyleSheet.absoluteFill}
        columns={3}
        rows={3}
        colors={colors}
        points={MESH_POINTS}
        smoothsColors
      />
    </View>
  );
}
