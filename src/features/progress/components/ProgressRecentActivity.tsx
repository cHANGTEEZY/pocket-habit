import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import type { HabitLog } from "@/api/types";
import { toDateKey } from "@/api/habit-logs";
import { Typography } from "heroui-native/text";

type ProgressRecentActivityProps = {
  logs: HabitLog[];
};

function relativeDayLabel(dateKey: string, now = new Date()): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round(
    (today.getTime() - target.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return target.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ProgressRecentActivity({ logs }: ProgressRecentActivityProps) {
  const muted = useCSSVariable("--color-muted");
  const mutedColor = typeof muted === "string" ? muted : "#8A8A8F";

  if (logs.length === 0) {
    return (
      <View
        className="gap-2 rounded-4xl bg-surface px-4 py-5"
        style={{ borderCurve: "continuous" }}
      >
        <Typography type="h5" weight="semibold" className="text-foreground">
          Recent activity
        </Typography>
        <Typography type="body-sm" className="text-muted">
          Check off habits on Today and they’ll show up here.
        </Typography>
      </View>
    );
  }

  return (
    <View
      className="gap-1 rounded-4xl bg-surface px-4 py-5"
      style={{ borderCurve: "continuous" }}
    >
      <Typography type="h5" weight="semibold" className="mb-2 text-foreground">
        Recent activity
      </Typography>
      {logs.map((log) => {
        const name = log.expand?.habit?.name ?? "Habit";
        const day = relativeDayLabel(toDateKey(log.date));
        const time = formatTime(log.completed_at ?? log.created);

        return (
          <View
            key={log.id}
            className="flex-row items-center gap-3 py-3"
            accessibilityLabel={`${name}, ${day}${time ? `, ${time}` : ""}`}
          >
            <View className="size-10 items-center justify-center rounded-full bg-surface-secondary">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                color={mutedColor}
                strokeWidth={1.75}
              />
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <Typography
                type="body"
                weight="medium"
                className="text-foreground"
                numberOfLines={1}
              >
                {name}
              </Typography>
              <Typography type="body-xs" className="text-muted">
                {day}
                {time ? ` · ${time}` : ""}
              </Typography>
            </View>
          </View>
        );
      })}
    </View>
  );
}
