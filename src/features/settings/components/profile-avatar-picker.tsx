import { type ReactNode } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useCSSVariable } from "uniwind";

import { AiImageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

type ProfileAvatarPickerProps = {
  onTakePhoto?: () => void | Promise<void>;
  onChooseFromLibrary?: () => void | Promise<void>;
  children: ReactNode;
};

function runPickerAction(action?: () => void | Promise<void>) {
  if (!action) return;

  // Defer until after the action sheet / alert has fully dismissed.
  setTimeout(() => {
    void action();
  }, Platform.OS === "ios" ? 350 : 100);
}

function showAvatarPickerOptions(
  onTakePhoto?: () => void | Promise<void>,
  onChooseFromLibrary?: () => void | Promise<void>,
) {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take a photo", "Choose from library"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) runPickerAction(onTakePhoto);
        if (buttonIndex === 2) runPickerAction(onChooseFromLibrary);
      },
    );
    return;
  }

  Alert.alert("Change profile picture", undefined, [
    { text: "Take a photo", onPress: () => runPickerAction(onTakePhoto) },
    {
      text: "Choose from library",
      onPress: () => runPickerAction(onChooseFromLibrary),
    },
    { text: "Cancel", style: "cancel" },
  ]);
}

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
          <Pressable
            accessibilityLabel="Change profile picture"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => showAvatarPickerOptions(onTakePhoto, onChooseFromLibrary)}
            className="size-8 items-center justify-center rounded-full bg-background"
            style={{ borderCurve: "continuous" }}
          >
            <HugeiconsIcon icon={AiImageIcon} size={22} color={foreground} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
