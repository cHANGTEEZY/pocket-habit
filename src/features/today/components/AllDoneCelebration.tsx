import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { CheckmarkCircleIcon, FlameIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { BottomSheet } from "heroui-native/bottom-sheet";
import { Button } from "heroui-native/button";
import { Typography } from "heroui-native/text";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useCSSVariable } from "uniwind";

import {
  toDateKey,
  todayDateKey,
  useHabitLogsInRange,
  useHabits,
  useTodayHabitLogs,
  useTodayHabits,
} from "@/api";
import { runHaptic } from "@/components/HapticButton";
import { accentTint, CARD_ACCENT } from "@/features/progress/lib/card-colors";
import { addDays, startOfLocalDay } from "@/features/progress/lib/schedule";
import { computeProgressStats } from "@/features/progress/lib/stats";

import {
  pickCongratsMessage,
  type CongratsMessage,
} from "../lib/congrats-messages";

function themeColor(
  value: string | number | undefined,
  fallback: string,
): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

type Stage = "idle" | "congrats" | "streak";

const STREAK_LOOKBACK_DAYS = 90;
const SHEET_RADIUS = 32;
const SHEET_INSET = 5;
const CELEBRATION_DELAY_MS = 1200;

let washUid = 0;

/** Subtle top glow painted on the sheet background (under the handle). */
function CelebrationSheetBackground({
  style,
  glowColor,
}: BottomSheetBackgroundProps & {
  glowColor: string;
}) {
  const overlay = useCSSVariable("--color-overlay");
  const surface = themeColor(overlay, "#FFFFFF");
  const id = useRef(`cw${++washUid}`).current;
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  const washHeight = size ? Math.round(size.height * 0.42) : 0;

  return (
    <View
      pointerEvents="none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((prev) =>
          prev && prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      }}
      style={[
        style,
        {
          backgroundColor: surface,
          borderRadius: SHEET_RADIUS,
          overflow: "hidden",
        } satisfies ViewStyle,
      ]}
    >
      {size && washHeight > 0 ? (
        <Svg width={size.width} height={washHeight}>
          <Defs>
            <LinearGradient id={`${id}_v`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0.28" />
              <Stop offset="45%" stopColor={glowColor} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </LinearGradient>
            <RadialGradient id={`${id}_r`} cx="50%" cy="0%" rx="72%" ry="100%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0.32" />
              <Stop offset="55%" stopColor={glowColor} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={washHeight}
            fill={`url(#${id}_v)`}
          />
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={washHeight}
            fill={`url(#${id}_r)`}
          />
        </Svg>
      ) : null}
    </View>
  );
}

function makeThemeBackground(
  token: `--color-${string}`,
  fallback: string,
) {
  return function Background(props: BottomSheetBackgroundProps) {
    const glowVar = useCSSVariable(token);
    return (
      <CelebrationSheetBackground
        {...props}
        glowColor={themeColor(glowVar, fallback)}
      />
    );
  };
}

const CongratsBackground = makeThemeBackground(
  "--color-success",
  "#2FBE73",
);
const StreakBackground = makeThemeBackground("--color-warning", "#C49A3A");

const HANDLE_STYLE: StyleProp<ViewStyle> = {
  backgroundColor: "transparent",
  paddingTop: 10,
  paddingBottom: 4,
};

/** Equal float on left/right; bottom uses the same inset via `bottomInset`. */
const SHEET_STYLE: StyleProp<ViewStyle> = {
  marginHorizontal: SHEET_INSET,
};

function streakRange() {
  const today = startOfLocalDay(new Date());
  return {
    from: toDateKey(addDays(today, -(STREAK_LOOKBACK_DAYS - 1))),
    to: toDateKey(today),
  };
}

export default function AllDoneCelebration() {
  // Raw device inset (home indicator) — not the tab-inflated screen inset.
  const contentBottomPad = Math.max(
    initialWindowMetrics?.insets.bottom ?? 0,
    16,
  );
  const { data: habits = [] } = useTodayHabits();
  const { data: todayLogs = [] } = useTodayHabitLogs();

  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState<CongratsMessage>(() =>
    pickCongratsMessage(),
  );

  const prevAllDoneRef = useRef(false);
  const shownKeyRef = useRef<string | null>(null);

  const success = useCSSVariable("--color-success");
  const successColor = themeColor(success, "#2FBE73");
  const warning = useCSSVariable("--color-warning");
  const flameColor = themeColor(warning, CARD_ACCENT.week);

  const allDone = useMemo(() => {
    if (habits.length === 0) return false;
    const doneIds = new Set(
      todayLogs.filter((log) => log.completed).map((log) => log.habit),
    );
    return habits.every((habit) => doneIds.has(habit.id));
  }, [habits, todayLogs]);

  useEffect(() => {
    if (!allDone) {
      prevAllDoneRef.current = false;
      shownKeyRef.current = null;
      return;
    }

    const key = todayDateKey();
    const transitioned = !prevAllDoneRef.current;
    prevAllDoneRef.current = true;
    if (!transitioned || shownKeyRef.current === key) return;

    shownKeyRef.current = key;
    setMessage(pickCongratsMessage());

    const timeoutId = setTimeout(() => {
      setStage("congrats");
      void runHaptic({
        type: "notification",
        style: Haptics.NotificationFeedbackType.Success,
      });
    }, CELEBRATION_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [allDone]);

  const streakEnabled = stage === "congrats" || stage === "streak";

  const range = useMemo(streakRange, []);

  const allHabitsQuery = useHabits(
    { status: "active", routine: "all" },
    { enabled: streakEnabled },
  );
  const logsQuery = useHabitLogsInRange(range.from, range.to, {
    enabled: streakEnabled,
  });

  const streakDataPending =
    streakEnabled && (allHabitsQuery.isFetching || logsQuery.isFetching);

  const currentStreak = useMemo(() => {
    if (!streakEnabled) return 0;
    return computeProgressStats(allHabitsQuery.data ?? [], logsQuery.data ?? [])
      .currentStreak;
  }, [streakEnabled, allHabitsQuery.data, logsQuery.data]);

  useEffect(() => {
    if (stage !== "streak") return;
    if (!streakDataPending && currentStreak === 0) {
      setStage("idle");
    }
  }, [stage, streakDataPending, currentStreak]);

  const handleCongratsDismiss = useCallback(() => {
    setStage("streak");
  }, []);

  const handleStreakDismiss = useCallback(() => {
    setStage("idle");
  }, []);

  return (
    <>
      <BottomSheet
        isOpen={stage === "congrats"}
        onOpenChange={(open: boolean) => {
          if (!open) handleCongratsDismiss();
        }}
      >
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content
            detached
            bottomInset={SHEET_INSET}
            style={SHEET_STYLE}
            snapPoints={["48%"]}
            enableDynamicSizing={false}
            enableOverDrag={false}
            backgroundComponent={CongratsBackground}
            handleStyle={HANDLE_STYLE}
            handleIndicatorClassName="bg-separator/50"
            contentContainerClassName="h-full bg-transparent px-5 pb-0 pt-1"
            contentContainerProps={{
              style: { paddingBottom: contentBottomPad },
            }}
          >
            <View className="flex-1 items-center justify-center">
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 72,
                  height: 72,
                  backgroundColor: accentTint(successColor, "1F"),
                }}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircleIcon}
                  size={42}
                  color={successColor}
                  strokeWidth={1.5}
                />
              </View>
              <Typography
                type="h1"
                weight="semibold"
                className="mt-6 text-center"
              >
                {message.headline}
              </Typography>
              <Typography
                type="body-sm"
                color="muted"
                className="mt-1.5 text-center leading-relaxed"
              >
                {message.subtext}
              </Typography>
              <Button
                variant="primary"
                size="lg"
                className="mt-7 w-full"
                accessibilityRole="button"
                accessibilityLabel="Show my streak"
                onPress={handleCongratsDismiss}
              >
                <Button.Label>Nice</Button.Label>
              </Button>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>

      <BottomSheet
        isOpen={stage === "streak"}
        onOpenChange={(open: boolean) => {
          if (!open) handleStreakDismiss();
        }}
      >
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content
            detached
            bottomInset={SHEET_INSET}
            style={SHEET_STYLE}
            snapPoints={["44%"]}
            enableDynamicSizing={false}
            enableOverDrag={false}
            backgroundComponent={StreakBackground}
            handleStyle={HANDLE_STYLE}
            handleIndicatorClassName="bg-separator/50"
            contentContainerClassName="h-full bg-transparent px-5 pb-0 pt-1"
            contentContainerProps={{
              style: { paddingBottom: contentBottomPad },
            }}
          >
            <View className="flex-1 items-center justify-center">
              {streakDataPending ? (
                <Typography type="body-sm" color="muted">
                  Tallying your streak…
                </Typography>
              ) : (
                <>
                  <View className="flex-row items-center gap-3">
                    <HugeiconsIcon
                      icon={FlameIcon}
                      size={38}
                      color={flameColor}
                      strokeWidth={1.5}
                    />
                    <View className="flex-row items-baseline gap-1.5">
                      <Typography
                        type="h1"
                        weight="semibold"
                        style={{ color: flameColor }}
                      >
                        {currentStreak}
                      </Typography>
                      <Typography type="body" weight="semibold">
                        {currentStreak === 1 ? "day" : "days"}
                      </Typography>
                    </View>
                  </View>
                  <Typography
                    type="body-sm"
                    color="muted"
                    className="mt-2.5 text-center leading-relaxed"
                  >
                    {currentStreak === 1
                      ? "Day one of a streak. Come back tomorrow to keep it alive."
                      : `${currentStreak} perfect days in a row. Keep the run going.`}
                  </Typography>
                  <Button
                    variant="primary"
                    size="lg"
                    className="mt-7 w-full"
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    onPress={handleStreakDismiss}
                  >
                    <Button.Label>Keep it up</Button.Label>
                  </Button>
                </>
              )}
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}
