import ProfileButton from "@/components/ProfileButton";
import { AiImageIcon, Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Popover, PressableFeedback, useThemeColor } from "heroui-native";
import { Typography } from "heroui-native/text";
import { Pressable, View } from "react-native";

const ProfileForm = () => {
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <View className="items-center gap-4">
      <View className="relative">
        <ProfileButton size="xlg" color="default" variant="soft" />
        <View className="absolute -bottom-1 -right-2 z-10">
          <Popover>
            <Popover.Trigger asChild>
              <Pressable
                accessibilityLabel="Change profile picture"
                accessibilityRole="button"
                hitSlop={8}
                className="size-8 items-center justify-center rounded-full bg-accent"
                style={{ borderCurve: "continuous" }}
              >
                <HugeiconsIcon
                  icon={AiImageIcon}
                  size={16}
                  color={accentForeground}
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
                <PressableFeedback
                  animation={false}
                  accessibilityRole="button"
                  accessibilityLabel="Take picture"
                  onPress={() => {
                    console.log("take picture");
                  }}
                  className="rounded-lg"
                >
                  <PressableFeedback.Scale className="px-3.5 py-2.5 flex-row items-center gap-2">
                    <HugeiconsIcon
                      icon={Camera01Icon}
                      size={22}
                      color={accentForeground}
                    />
                    <Typography type="body-sm" weight="medium">
                      Take picture
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

                <PressableFeedback
                  animation={false}
                  accessibilityRole="button"
                  accessibilityLabel="Choose from gallery"
                  onPress={() => {
                    console.log("choose from gallery");
                  }}
                  className="rounded-lg"
                >
                  <PressableFeedback.Scale className="px-3.5 py-2.5 flex-row items-center gap-2">
                    <HugeiconsIcon
                      icon={AiImageIcon}
                      size={22}
                      color={accentForeground}
                    />
                    <Typography type="body-sm" weight="medium">
                      Choose from gallery
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
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        </View>
      </View>
    </View>
  );
};

export default ProfileForm;
