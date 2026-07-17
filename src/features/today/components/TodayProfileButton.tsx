import { router } from "expo-router";
import { Pressable } from "react-native";

import { useSession } from "@/api";

import { Avatar } from "heroui-native/avatar";

import { getInitials } from "../lib/greeting";

export default function TodayProfileButton() {
  const { session } = useSession();
  const initials = getInitials(session?.record?.name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Profile"
      hitSlop={8}
      onPress={() => {
        router.navigate("/profile");
      }}
    >
      <Avatar size="sm" color="accent" variant="soft">
        {initials ? (
          <Avatar.Fallback
            styles={{
              text: {
                color: "white",
              },
            }}
          >
            {initials}
          </Avatar.Fallback>
        ) : (
          <Avatar.Fallback />
        )}
      </Avatar>
    </Pressable>
  );
}
