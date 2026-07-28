import { Pressable, View } from "react-native";

import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import ProfileButton from "@/components/ProfileButton";

import { AiImageIcon, Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Popover, PressableFeedback } from "heroui-native";
import { Typography } from "heroui-native/text";
import { useCSSVariable } from "uniwind";

import ProfileForm, { useProfileForm } from "../components/profile-form";
import { ProfileSaveButton } from "../components/profile-save-button";

const EditProfile = () => {
  const form = useProfileForm();
  const foregroundVar = useCSSVariable("--color-foreground");
  const foreground =
    typeof foregroundVar === "string" ? foregroundVar : "#1C1C1E";

  return (
    <View className="flex-1 bg-background">
      <CollapsedLargeHeader
        title="Edit Profile"
        leading={<GoBackButton />}
        trailing={
          <form.Subscribe
            selector={(state) =>
              [state.canSubmit, state.isSubmitting, state.isDirty] as const
            }
          >
            {([canSubmit, isSubmitting, isDirty]) => (
              <ProfileSaveButton
                disabled={!isDirty || !canSubmit}
                isSubmitting={isSubmitting}
                onPress={() => form.handleSubmit()}
              />
            )}
          </form.Subscribe>
        }
      >
        <View className="my-5 items-center">
          <View className="relative size-20">
            <ProfileButton size="xlg" />
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
                    <PressableFeedback
                      animation={false}
                      accessibilityRole="button"
                      accessibilityLabel="Take a photo"
                      onPress={() => {
                        console.log("take photo");
                      }}
                      className="rounded-lg"
                    >
                      <PressableFeedback.Scale className="flex-row items-center gap-2 px-3.5 py-2.5">
                        <HugeiconsIcon
                          icon={Camera01Icon}
                          size={22}
                          color={foreground}
                        />
                        <Typography type="body-sm" weight="medium">
                          Take a photo
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
                      accessibilityLabel="Choose from library"
                      onPress={() => {
                        console.log("choose from library");
                      }}
                      className="rounded-lg"
                    >
                      <PressableFeedback.Scale className="flex-row items-center gap-2 px-3.5 py-2.5">
                        <HugeiconsIcon
                          icon={AiImageIcon}
                          size={22}
                          color={foreground}
                        />
                        <Typography type="body-sm" weight="medium">
                          Choose from library
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

        <View className="mt-5 gap-2 px-4 pb-8">
          <ProfileForm form={form} />
        </View>
      </CollapsedLargeHeader>
    </View>
  );
};

export default EditProfile;
