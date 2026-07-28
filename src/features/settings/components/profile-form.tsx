import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { View, type TextInput } from "react-native";

import { Separator, useToast } from "heroui-native";

import { useSession } from "@/api";
import { updateCurrentUserProfile } from "@/lib/pocketbase";
import { formatPocketBaseError, getFieldError } from "@/utils/errors";
import { logger } from "@/utils/logger";

import {
  profileFormSchema,
  type ProfileFormInput,
} from "../schemas/profile-form";
import { ProfileFormField } from "./profile-form-field";
import { SettingsSection } from "./settings-section";

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getDefaultValues(
  record: Record<string, unknown> | null | undefined,
): ProfileFormInput {
  return {
    name: readString(record?.name),
    email: readString(record?.email),
    bio: readString(record?.bio),
  };
}

export function useProfileForm() {
  const { session } = useSession();
  const { toast } = useToast();
  const record = session?.record as Record<string, unknown> | null | undefined;

  const form = useForm({
    defaultValues: getDefaultValues(record),
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmitInvalid: () => {
      toast.show({
        variant: "danger",
        label: "Check the form",
        description: "Fix the highlighted fields and try again.",
      });
    },
    onSubmit: async ({ value }) => {
      try {
        const parsed = profileFormSchema.parse(value);
        const updated = await updateCurrentUserProfile(parsed);
        logger.info("profile updated", updated.id);
        form.reset(parsed);
        toast.show({
          variant: "success",
          label: "Profile saved",
          description: "Your changes were updated successfully.",
        });
      } catch (error) {
        const description = formatPocketBaseError(error);
        logger.error("profile update failed", description);
        toast.show({
          variant: "danger",
          label: "Couldn't save profile",
          description,
        });
      }
    },
  });

  return form;
}

type ProfileFormProps = {
  form: ReturnType<typeof useProfileForm>;
};

export default function ProfileForm({ form }: ProfileFormProps) {
  const emailRef = useRef<TextInput>(null);

  return (
    <View className="gap-6">
      <SettingsSection>
        <form.Field name="name">
          {(field) => (
            <ProfileFormField
              label="Name"
              placeholder="Your name"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}
        </form.Field>
        <Separator className="mx-4" />
        <form.Field name="email">
          {(field) => (
            <ProfileFormField
              ref={emailRef}
              label="Email"
              placeholder="you@example.com"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              maxLength={255}
              returnKeyType="done"
            />
          )}
        </form.Field>
      </SettingsSection>

      <SettingsSection title="Bio">
        <form.Field name="bio">
          {(field) => (
            <ProfileFormField
              label="Bio"
              placeholder="A short bio"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              multiline
              maxLength={500}
            />
          )}
        </form.Field>
      </SettingsSection>
    </View>
  );
}
