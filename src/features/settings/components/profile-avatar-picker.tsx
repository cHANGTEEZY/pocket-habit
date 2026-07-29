import { type ComponentProps, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { AiImageIcon, Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Popover, PressableFeedback } from "heroui-native";
import { Typography } from "heroui-native/text";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

type ProfileAvatarMenuItemProps = {
  icon: IconData;
  label: string;
  onPress: () => void;
  iconColor: string;
};

function ProfileAvatarMenuItem({
  icon,
  label,
  onPress,
  iconColor,
}: ProfileAvatarMenuItemProps) {
  return (
    <PressableFeedback
      animation={false}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="rounded-lg"
    >
      <PressableFeedback.Scale className="flex-row items-center gap-2 px-3.5 py-2.5">
        <HugeiconsIcon icon={icon} size={22} color={iconColor} />
        <Typography type="body-sm" weight="medium">
          {label}
        </Typography>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple
        animation={{
          backgroundColor: { value: "#e0e7ff" },
          opacity: { value: [0.2, 0.2, 0] },
          progress: { baseDuration: 240 },
        }}
      />
    </PressableFeedback>
  );
}

type ProfileAvatarPickerProps = {
  onTakePhoto?: () => void;
  onChooseFromLibrary?: () => void;
  children: ReactNode;
};

export function ProfileAvatarPicker({
  onTakePhoto,
  onChooseFromLibrary,
  children,
}: ProfileAvatarPickerProps) {
  const foregroundVar = useCSSVariable("--color-foreground");
  const foreground =
    typeof foregroundVar === "string" ? foregroundVar : "#1C1C1E";

  return (
    <View className="items-center">
      <View className="relative size-20">
        {children}
        <View className="absolute -bottom-1 -right-1 z-10">
          <Popover>
            <Popover.Trigger asChild>
              <Pressable
                accessibilityLabel="Change profile picture"
                accessibilityRole="button"
                hitSlop={8}
                className="size-8 items-center justify-center rounded-full bg-background"
                style={{ borderCurve: "continuous" }}
              >
                <HugeiconsIcon
                  icon={AiImageIcon}
                  size={22}
                  color={foreground}
                />
              </Pressable>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Overlay />
              <Popover.Content
                presentation="popover"
                placement="bottom"
                className="min-w-56 gap-1 rounded-xl p-1.5"
              >
                <ProfileAvatarMenuItem
                  icon={Camera01Icon}
                  label="Take a photo"
                  iconColor={foreground}
                  onPress={() => onTakePhoto?.()}
                />
                <ProfileAvatarMenuItem
                  icon={AiImageIcon}
                  label="Choose from library"
                  iconColor={foreground}
                  onPress={() => onChooseFromLibrary?.()}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        </View>
      </View>
    </View>
  );
}
