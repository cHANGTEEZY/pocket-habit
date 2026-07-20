import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useCSSVariable } from "uniwind";

export type CircularProgressProps = {
  /** Progress from 0–100 */
  value: number;
  /** Outer diameter in px. @default 56 */
  size?: number;
  /** Ring stroke width in px. @default 5 */
  strokeWidth?: number;
  /** Color of the completed (filled) arc */
  progressColor?: string;
  /** Color of the incomplete (track) arc */
  trackColor?: string;
  /** Optional content centered inside the ring */
  children?: ReactNode;
  accessibilityLabel?: string;
  className?: string;
};

export default function CircularProgress({
  value,
  size = 56,
  strokeWidth = 5,
  progressColor: progressColorProp,
  trackColor: trackColorProp,
  children,
  accessibilityLabel,
  className,
}: CircularProgressProps) {
  const accent = useCSSVariable("--color-accent");
  const border = useCSSVariable("--color-border");

  const progressColor =
    progressColorProp ??
    (typeof accent === "string" ? accent : "#007AFF");
  const trackColor =
    trackColorProp ?? (typeof border === "string" ? border : "#E5E5EA");

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference * (1 - clamped / 100);

  return (
    <View
      className={`items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children != null ? (
        <View className="absolute inset-0 items-center justify-center">
          {children}
        </View>
      ) : null}
    </View>
  );
}
