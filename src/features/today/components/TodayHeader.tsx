import { Pressable, View } from "react-native";

import { useSession } from "@/api";

import { Avatar } from "heroui-native/avatar";
import { Typography } from "heroui-native/text";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function TodayHeader() {
  const { session } = useSession();
  const greeting = getGreeting(new Date().getHours());
  const initials = getInitials(session?.record?.name);
  const image =
    typeof session?.record?.avatar === "string"
      ? session.record.avatar
      : typeof session?.record?.image === "string"
        ? session.record.image
        : null;

  return (
    <View
      className="mb-6 flex-row items-center justify-between"
      accessibilityRole="header"
      accessibilityLabel={greeting}
    >
      <Typography type="h1" weight="semibold" className="text-foreground">
        {greeting}
      </Typography>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        hitSlop={8}
      >
        <Avatar size="sm" color="accent" variant="soft">
          {image ? <Avatar.Image source={{ uri: image }} /> : null}
          {initials ? (
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          ) : (
            <Avatar.Fallback />
          )}
        </Avatar>
      </Pressable>
    </View>
  );
}
