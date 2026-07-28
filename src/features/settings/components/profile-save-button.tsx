import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Pressable } from "react-native";
import { useCSSVariable } from "uniwind";

import { Spinner } from "heroui-native/spinner";

type ProfileSaveButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onPress: () => void;
};

export function ProfileSaveButton({
  disabled = false,
  isSubmitting = false,
  onPress,
}: ProfileSaveButtonProps) {
  const foreground = useCSSVariable("--color-foreground");
  const muted = useCSSVariable("--color-muted");
  const activeColor = typeof foreground === "string" ? foreground : "#ffffff";
  const inactiveColor = typeof muted === "string" ? muted : "#8A8A8F";
  const isDisabled = disabled || isSubmitting;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Save profile"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={8}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-surface-secondary"
      style={{ borderCurve: "continuous", opacity: isDisabled ? 0.45 : 1 }}
    >
      {isSubmitting ? (
        <Spinner size="sm" color={activeColor} />
      ) : (
        <HugeiconsIcon
          icon={Tick02Icon}
          size={20}
          color={isDisabled ? inactiveColor : activeColor}
          strokeWidth={1.75}
        />
      )}
    </Pressable>
  );
}
