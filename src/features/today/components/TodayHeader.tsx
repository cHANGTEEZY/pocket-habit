import { View } from "react-native";

import { useSession } from "@/api";

import { Typography } from "heroui-native/text";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const first = name.trim().split(/\s+/)[0];
  return first || null;
}

function formatTodayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

type TodayHeaderProps = {
  /** When true, uses inviting empty-state copy instead of the checklist subtitle. */
  isEmpty?: boolean;
};

export default function TodayHeader({ isEmpty = true }: TodayHeaderProps) {
  const { session } = useSession();
  const now = new Date();
  const firstName = getFirstName(session?.record?.name);
  const greeting = getGreeting(now.getHours());
  const title = firstName ? `${greeting}, ${firstName}` : greeting;

  return (
    <View
      className="mb-8 gap-3"
      accessibilityRole="header"
      accessibilityLabel={`${title}. ${formatTodayLabel(now)}`}
    >
      <Typography type="body-sm" weight="medium" color="muted">
        {formatTodayLabel(now)}
      </Typography>

      <View className="gap-1.5">
        <Typography type="h1" weight="semibold" className="text-foreground">
          {title}
        </Typography>
        <Typography type="body" color="muted" className="leading-relaxed">
          {isEmpty
            ? "A quiet start. Pick one small habit — checking in is enough."
            : "Your habits for this day."}
        </Typography>
      </View>
    </View>
  );
}
