import { View } from "react-native";

import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import ProfileButton from "@/components/ProfileButton";

import { ProfileAvatarPicker } from "../components/profile-avatar-picker";
import ProfileForm, { useProfileForm } from "../components/profile-form";
import { ProfileSaveButton } from "../components/profile-save-button";

export default function EditProfile() {
  const form = useProfileForm();

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
            onTakePhoto={() => console.log("take photo")}
            onChooseFromLibrary={() => console.log("choose from library")}
          >
            <ProfileButton size="xlg" />
          </ProfileAvatarPicker>
        </View>

        <View className="mt-5 gap-2 px-4 pb-8">
          <ProfileForm form={form} />
        </View>
      </CollapsedLargeHeader>
    </View>
  );
}
