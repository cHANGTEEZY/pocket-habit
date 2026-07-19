import { memo, useCallback, useMemo, useState } from "react";
import {
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useCSSVariable } from "uniwind";

import { FieldError } from "heroui-native/field-error";
import { Typography } from "heroui-native/text";

import { SettingsRow } from "@/features/settings/components/settings-row";

import { HabitFormField } from "./habit-form-field";

type HabitDateTimePickerRowProps = {
  title: string;
  description?: string;
  /** Marks the control as required in the trailing affordance. */
  required?: boolean;
  mode: "date" | "time";
  value: Date;
  valueLabel: string;
  onChange: (date: Date) => void;
  error?: string;
  webValue: string;
  onWebChangeText: (text: string) => void;
  webPlaceholder?: string;
  webKeyboardType?: "default" | "number-pad" | "numbers-and-punctuation";
  webMaxLength?: number;
};

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

/**
 * Inline day/time chooser for the habit bottom sheet.
 *
 * Heavy mount work is deferred until after the row's press ripple finishes,
 * and chips use plain Pressable (no Reanimated ripples) so expanding doesn't stall UI.
 */
export function HabitDateTimePickerRow({
  title,
  description,
  required = false,
  mode,
  value,
  valueLabel,
  onChange,
  error,
  webValue,
  onWebChangeText,
  webPlaceholder,
  webKeyboardType,
  webMaxLength,
}: HabitDateTimePickerRowProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const accent = useCSSVariable("--color-accent");
  const muted = useCSSVariable("--color-muted");
  const foreground = useCSSVariable("--color-foreground");
  const border = useCSSVariable("--color-border");

  const accentColor = typeof accent === "string" ? accent : "#007AFF";
  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";
  const selectedText =
    typeof foreground === "string" ? foreground : "#FFFFFF";
  const idleBorder = typeof border === "string" ? border : "#3A3A3C";

  const toggleOpen = useCallback(() => {
    // Finish SettingsRow ripple before mounting/unmounting a large subtree.
    InteractionManager.runAfterInteractions(() => {
      setOpen((prev) => {
        const next = !prev;
        if (next) setMounted(true);
        return next;
      });
    });
  }, []);

  const closeAfterInteractions = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      setOpen(false);
    });
  }, []);

  if (Platform.OS === "web") {
    return (
      <HabitFormField
        label={title}
        required={required}
        placeholder={webPlaceholder}
        value={webValue}
        onChangeText={onWebChangeText}
        error={error}
        keyboardType={webKeyboardType}
        autoCapitalize="none"
        maxLength={webMaxLength}
      />
    );
  }

  const selectedDay = value.getDate();
  const selectedHour = value.getHours();
  const selectedMinute = Math.round(value.getMinutes() / 5) * 5;
  const safeMinute = selectedMinute >= 60 ? 0 : selectedMinute;
  const rowDescription = [
    description,
    required ? "Required" : "Optional",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <View>
      <SettingsRow
        title={title}
        description={rowDescription}
        trailing={
          <Typography
            type="body"
            style={{ color: open ? accentColor : mutedColor }}
          >
            {valueLabel}
          </Typography>
        }
        onPress={toggleOpen}
      />

      {mounted ? (
        <View
          pointerEvents={open ? "auto" : "none"}
          style={{
            height: open ? undefined : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {mode === "date" ? (
            <View className="gap-2 px-4 pb-3 pt-1">
              <Typography type="body-sm" className="text-muted">
                Day of each month
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {MONTH_DAYS.map((day) => (
                  <Chip
                    key={day}
                    label={String(day)}
                    selected={selectedDay === day}
                    selectedBorder={accentColor}
                    idleBorder={idleBorder}
                    selectedText={selectedText}
                    idleText={mutedColor}
                    onPress={() => {
                      onChange(new Date(2024, 0, day, 12, 0, 0, 0));
                      closeAfterInteractions();
                    }}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View className="gap-3 px-4 pb-3 pt-1">
              <TimeStrip
                label="Hour"
                values={HOURS}
                selected={selectedHour}
                format={(n) => String(n).padStart(2, "0")}
                selectedBorder={accentColor}
                idleBorder={idleBorder}
                selectedText={selectedText}
                idleText={mutedColor}
                onSelect={(hour) => {
                  const next = new Date(value);
                  next.setHours(hour);
                  next.setMinutes(safeMinute);
                  onChange(next);
                }}
              />
              <TimeStrip
                label="Minute"
                values={MINUTES}
                selected={safeMinute}
                format={(n) => String(n).padStart(2, "0")}
                selectedBorder={accentColor}
                idleBorder={idleBorder}
                selectedText={selectedText}
                idleText={mutedColor}
                onSelect={(minute) => {
                  const next = new Date(value);
                  next.setMinutes(minute);
                  onChange(next);
                }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Done choosing time"
                onPress={closeAfterInteractions}
                className="mt-1 items-center justify-center rounded-2xl py-3"
                style={{
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: accentColor,
                }}
              >
                <Typography
                  type="body-sm"
                  weight="semibold"
                  style={{ color: accentColor }}
                >
                  Done
                </Typography>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}

      {error ? (
        <View className="px-4 pb-3">
          <FieldError isInvalid>{error}</FieldError>
        </View>
      ) : null}
    </View>
  );
}

const Chip = memo(function Chip({
  label,
  selected,
  selectedBorder,
  idleBorder,
  selectedText,
  idleText,
  onPress,
}: {
  label: string;
  selected: boolean;
  selectedBorder: string;
  idleBorder: string;
  selectedText: string;
  idleText: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        height: 40,
        minWidth: 40,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        borderCurve: "continuous",
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected ? selectedBorder : idleBorder,
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: selected ? selectedText : idleText,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
});

const TimeStrip = memo(function TimeStrip({
  label,
  values,
  selected,
  format,
  selectedBorder,
  idleBorder,
  selectedText,
  idleText,
  onSelect,
}: {
  label: string;
  values: number[];
  selected: number;
  format: (n: number) => string;
  selectedBorder: string;
  idleBorder: string;
  selectedText: string;
  idleText: string;
  onSelect: (n: number) => void;
}) {
  const nearest = useMemo(() => {
    if (values.includes(selected)) return selected;
    return values.reduce((best, n) =>
      Math.abs(n - selected) < Math.abs(best - selected) ? n : best,
    );
  }, [selected, values]);

  return (
    <View className="gap-2">
      <Typography type="body-sm" weight="medium" className="text-muted">
        {label}
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {values.map((n) => (
          <Chip
            key={n}
            label={format(n)}
            selected={nearest === n}
            selectedBorder={selectedBorder}
            idleBorder={idleBorder}
            selectedText={selectedText}
            idleText={idleText}
            onPress={() => onSelect(n)}
          />
        ))}
      </ScrollView>
    </View>
  );
});

export function dateFromMonthlyDay(day: number | undefined): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const safeDay = Math.min(Math.max(day ?? now.getDate(), 1), 31);
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(safeDay, lastDay), 12, 0, 0, 0);
}

export function monthlyDayFromDate(date: Date): number {
  return date.getDate();
}

export function formatMonthlyDay(day: number | undefined): string {
  if (day == null) return "Choose";
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix}`;
}

export function dateFromReminderTime(time: string | undefined): Date {
  const now = new Date();
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time?.trim() ?? "");
  const hours = match ? Number(match[1]) : 9;
  const minutes = match ? Number(match[2]) : 0;
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export function reminderTimeFromDate(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatReminderTime(time: string | undefined): string {
  if (!time?.trim()) return "Choose";
  return time.trim();
}
