import { View } from "react-native";

import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import ProfileButton from "@/components/ProfileButton";

import { ProfileAvatarPicker } from "../components/profile-avatar-picker";
import ProfileForm, { useProfileForm } from "../components/profile-form";
import { ProfileSaveButton } from "../components/profile-save-button";
import { useProfileAvatarPicker } from "../hooks/use-profile-avatar-picker";

export default function EditProfile() {
  const form = useProfileForm();
  const { avatar, pickFromLibrary, takePhoto } = useProfileAvatarPicker();

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
        <View className="my-5">
          <ProfileAvatarPicker
            onTakePhoto={takePhoto}
            onChooseFromLibrary={pickFromLibrary}
          >
            <ProfileButton size="xlg" imageUri={avatar?.uri ?? null} />
          </ProfileAvatarPicker>
        </View>

        <View className="mt-5 gap-2 px-4 pb-8">
          <ProfileForm form={form} />
        </View>
      </CollapsedLargeHeader>
    </View>
  );
}
