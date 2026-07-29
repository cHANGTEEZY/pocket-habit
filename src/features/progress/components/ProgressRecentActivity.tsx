import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";

import type { HabitLog } from "@/api/types";
import { toDateKey } from "@/api/habit-logs";
import ProgressCard from "@/components/ProgressCard";
import { Typography } from "heroui-native/text";

import { accentTint, CARD_ACCENT } from "../lib/card-colors";

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
  const color = CARD_ACCENT.recent;

  if (logs.length === 0) {
    return (
      <ProgressCard
        leadingTitle="Recent activity"
        accentColor={color}
        contentClassName="gap-1"
      >
        <Typography type="body-sm" className="text-muted">
          Check off habits on Today and they’ll show up here.
        </Typography>
      </ProgressCard>
    );
  }

  return (
    <ProgressCard
      leadingTitle="Recent activity"
      accentColor={color}
      contentClassName="gap-0"
    >
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
            <View
              className="size-10 items-center justify-center rounded-full"
              style={{ backgroundColor: accentTint(color) }}
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                color={color}
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
    </ProgressCard>
  );
}
