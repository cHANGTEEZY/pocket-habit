import { useState } from "react";
import { Alert, View } from "react-native";

import { AlarmClockIcon, DangerIcon } from "@hugeicons/core-free-icons";
import { Separator, useToast } from "heroui-native";

import { useSession } from "@/api";
import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import ProfileButton from "@/components/ProfileButton";
import {
  updateCurrentUserEmail,
  updateCurrentUserPassword,
  updateCurrentUserPhone,
  updateCurrentUserUsername,
} from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

import { AccountEditSheet } from "../components/account-edit-sheet";
import { ProfileAvatarPicker } from "../components/profile-avatar-picker";
import ProfileForm, { useProfileForm } from "../components/profile-form";
import { ProfileSaveButton } from "../components/profile-save-button";
import { SettingsRow } from "../components/settings-row";
import { SettingsSection } from "../components/settings-section";
import { useProfileAvatarPicker } from "../hooks/use-profile-avatar-picker";
import type { AccountEditField, AccountEditValues } from "../schemas/account-edit";

const AccountSettings = () => {
  const { session } = useSession();
  const { toast } = useToast();
  const [editField, setEditField] = useState<AccountEditField | null>(null);

  const form = useProfileForm();
  const { avatar, pickFromLibrary, takePhoto } = useProfileAvatarPicker();

  const record = session?.record as Record<string, unknown> | null | undefined;
  const phone = typeof record?.phone === "string" ? record.phone : "";
  const username =
    (typeof record?.username === "string" ? record.username : "") ||
    (typeof record?.name === "string" ? record.name : "");

  const handleEditSubmit = async (values: AccountEditValues) => {
    try {
      switch (values.field) {
        case "email":
          await updateCurrentUserEmail(values.value);
          break;
        case "phone":
          await updateCurrentUserPhone(values.value);
          break;
        case "username":
          await updateCurrentUserUsername(values.value);
          break;
        case "password":
          await updateCurrentUserPassword(
            values.currentPassword,
            values.newPassword,
          );
          break;
      }
      toast.show({
        variant: "success",
        label: "Account updated",
        description: "Your changes were saved successfully.",
      });
    } catch (error) {
      const description = formatPocketBaseError(error);
      logger.error("account update failed", description);
      toast.show({
        variant: "danger",
        label: "Couldn't update account",
        description,
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <CollapsedLargeHeader
        title="Account"
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

        <View className="mt-5 gap-6 px-4 pb-8">
          <ProfileForm form={form} />

          <SettingsSection title="Basic Info">
            <SettingsRow
              title="Phone Number"
              description={phone || "Change your phone number"}
              edit={true}
              onPress={() => setEditField("phone")}
            />
            <Separator className="ml-5" />
            <SettingsRow
              title="Username"
              description={username || "Change your username"}
              edit={true}
              onPress={() => setEditField("username")}
            />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsRow
              title="Password"
              description="Change your password"
              edit={true}
              onPress={() => setEditField("password")}
            />
          </SettingsSection>

          <SettingsSection title="Reminders">
            <SettingsRow
              title="Habit check-in times"
              description="Daily reminder schedule is coming soon"
              icon={AlarmClockIcon}
              iconBackground="#AF52DE"
              trailing={null}
            />
          </SettingsSection>

          <SettingsSection title="Danger Zone" className="bg-danger-soft">
            <SettingsRow
              title="Delete Account"
              iconBackground="#F44336"
              icon={DangerIcon}
              trailing={null}
              onPress={() =>
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to delete your account? This action is irreversible.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        console.log("Delete account");
                      },
                    },
                  ],
                )
              }
            />
          </SettingsSection>
        </View>
      </CollapsedLargeHeader>

      <AccountEditSheet
        field={editField}
        onClose={() => setEditField(null)}
        onSubmit={handleEditSubmit}
      />
    </View>
  );
};

export default AccountSettings;
