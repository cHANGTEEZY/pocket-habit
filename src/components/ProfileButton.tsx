import { Pressable, View } from "react-native";

import { useSession } from "@/api";
import { Image } from "expo-image";
import {
  Avatar,
  type AvatarColor,
  type AvatarSize,
} from "heroui-native/avatar";

import { getCurrentUserAvatarUrl } from "@/lib/pocketbase";

import { getInitials } from "../features/today/lib/greeting";

type AvatarVariant = "default" | "soft";

/** HeroUI sizes plus an extra-large profile size. */
type ProfileButtonSize = AvatarSize | "xlg";

type ProfileButtonProps = {
  size?: ProfileButtonSize;
  color?: AvatarColor;
  variant?: AvatarVariant;
  imageUri?: string | null;
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
  rootClassName: string;
  textClassName?: string;
} {
  if (size === "xlg") {
    return {
      avatarSize: "lg",
      rootClassName: "size-20",
      textClassName: "text-lg",
    };
  }

  const sizeClasses: Record<AvatarSize, string> = {
    sm: "size-10",
    md: "size-12",
    lg: "size-16",
  };

  return { avatarSize: size, rootClassName: sizeClasses[size] };
}

export default function ProfileButton({
  size = "sm",
  color = "accent",
  variant = "default",
  imageUri,
  onPress,
}: ProfileButtonProps) {
  const { session } = useSession();
  const initials = getInitials(session?.record?.name);
  const isSolid = variant === "default";
  const { avatarSize, rootClassName, textClassName } = resolveAvatarSize(size);

  // Prefer an explicit URI (e.g. optimistic local pick), else the saved file URL.
  const resolvedUri =
    imageUri ?? (session?.isValid ? getCurrentUserAvatarUrl() : null);

  const rootClasses = [rootClassName, isSolid ? SOLID_BG[color] : undefined]
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
      {resolvedUri ? (
        <View
          className={`overflow-hidden rounded-full ${rootClasses}`}
          style={{ borderCurve: "continuous" }}
        >
          <Image
            source={{ uri: resolvedUri }}
            className="size-full"
            contentFit="cover"
            transition={150}
          />
        </View>
      ) : (
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
      )}
    </Pressable>
  );
}
