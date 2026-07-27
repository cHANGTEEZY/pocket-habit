import { Pressable } from "react-native";

import { useSession } from "@/api";
import {
  Avatar,
  type AvatarColor,
  type AvatarSize,
} from "heroui-native/avatar";

import { getInitials } from "../features/today/lib/greeting";

type AvatarVariant = "default" | "soft";

/** HeroUI sizes plus an extra-large profile size. */
type ProfileButtonSize = AvatarSize | "xlg";

type ProfileButtonProps = {
  size?: ProfileButtonSize;
  color?: AvatarColor;
  variant?: AvatarVariant;
  onPress?: () => void;
};

const SOLID_BG: Record<AvatarColor, string> = {
  accent: "bg-accent",
  default: "bg-default",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const SOLID_TEXT: Record<AvatarColor, string> = {
  accent: "text-accent-foreground",
  default: "text-default-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  danger: "text-danger-foreground",
};

/** Map custom sizes onto HeroUI Avatar props + className overrides. */
function resolveAvatarSize(size: ProfileButtonSize): {
  avatarSize: AvatarSize;
  rootClassName?: string;
  textClassName?: string;
} {
  if (size === "xlg") {
    return {
      avatarSize: "lg",
      rootClassName: "size-20",
      textClassName: "text-lg",
    };
  }
  return { avatarSize: size };
}

export default function ProfileButton({
  size = "sm",
  color = "accent",
  variant = "default",
  onPress,
}: ProfileButtonProps) {
  const { session } = useSession();
  const initials = getInitials(session?.record?.name);
  const isSolid = variant === "default";
  const { avatarSize, rootClassName, textClassName } = resolveAvatarSize(size);

  const rootClasses = [isSolid ? SOLID_BG[color] : undefined, rootClassName]
    .filter(Boolean)
    .join(" ");

  const fallbackTextClasses = [
    isSolid ? SOLID_TEXT[color] : undefined,
    textClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Profile"
      hitSlop={8}
      onPress={() => {
        onPress?.();
      }}
    >
      <Avatar
        size={avatarSize}
        color={color}
        variant={variant}
        className={rootClasses || undefined}
      >
        {initials ? (
          <Avatar.Fallback
            classNames={{
              text: fallbackTextClasses || undefined,
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
