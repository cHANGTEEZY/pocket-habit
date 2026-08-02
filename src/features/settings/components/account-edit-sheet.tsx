import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { forwardRef, useRef, useState, type ComponentProps } from "react";
import { Pressable, View, type TextInput } from "react-native";

import { useSession } from "@/api";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { getFieldError } from "@/utils/errors";

import { BottomSheet } from "heroui-native/bottom-sheet";
import { Button } from "heroui-native/button";
import { FieldError } from "heroui-native/field-error";
import { useBottomSheetAwareHandlers } from "heroui-native/hooks";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { Spinner } from "heroui-native/spinner";
import { TextField } from "heroui-native/text-field";

import {
  accountEditSchemas,
  type AccountEditField,
  type AccountEditValues,
} from "../schemas/account-edit";

type AccountEditSheetProps = {
  field: AccountEditField | null;
  onClose: () => void;
  onSubmit?: (values: AccountEditValues) => void | Promise<void>;
};

const SIMPLE_FIELD_META = {
  email: {
    title: "Change Email",
    description: "We'll ask you to verify your new address.",
    label: "Email",
    placeholder: "you@example.com",
    autoCapitalize: "none",
    autoComplete: "email",
    keyboardType: "email-address",
    textContentType: "emailAddress",
  },
  phone: {
    title: "Change Phone Number",
    description: "Used for account recovery and notifications.",
    label: "Phone Number",
    placeholder: "+1 555 123 4567",
    autoCapitalize: "none",
    autoComplete: "tel",
    keyboardType: "phone-pad",
    textContentType: "telephoneNumber",
  },
  username: {
    title: "Change Username",
    description: "Your public handle across the app.",
    label: "Username",
    placeholder: "janedoe",
    autoCapitalize: "none",
    autoComplete: "username",
    keyboardType: "default",
    textContentType: "username",
  },
} as const;

type SimpleField = keyof typeof SIMPLE_FIELD_META;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

type FieldInputProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
};

const SheetField = forwardRef<TextInput, FieldInputProps>(function SheetField(
  { label, error, ...inputProps },
  ref,
) {
  const { onFocus, onBlur } = useBottomSheetAwareHandlers();

  return (
    <TextField isInvalid={Boolean(error)}>
      <Label>{label}</Label>
      <Input ref={ref} onFocus={onFocus} onBlur={onBlur} {...inputProps} />
      {error ? <FieldError>{error}</FieldError> : null}
    </TextField>
  );
});

const SheetPasswordField = forwardRef<TextInput, FieldInputProps>(
  function SheetPasswordField({ label, error, ...inputProps }, ref) {
    const [visible, setVisible] = useState(false);
    const { onFocus, onBlur } = useBottomSheetAwareHandlers();

    return (
      <TextField isInvalid={Boolean(error)}>
        <Label>{label}</Label>
        <View className="w-full justify-center">
          <Input
            ref={ref}
            className="pr-12"
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={onFocus}
            onBlur={onBlur}
            {...inputProps}
          />
          <Pressable
            className="absolute right-3 h-11 w-11 items-center justify-center"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            onPress={() => setVisible((v) => !v)}
          >
            {visible ? (
              <EyeOffIcon size={20} className="text-muted" />
            ) : (
              <EyeIcon size={20} className="text-muted" />
            )}
          </Pressable>
        </View>
        {error ? <FieldError>{error}</FieldError> : null}
      </TextField>
    );
  },
);

type SubmitButtonProps = {
  isSubmitting: boolean;
  label: string;
  onPress: () => void;
};

function SubmitButton({ isSubmitting, label, onPress }: SubmitButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      isDisabled={isSubmitting}
      onPress={onPress}
    >
      {isSubmitting ? (
        <Spinner size="sm" color="white" />
      ) : (
        <Button.Label>{label}</Button.Label>
      )}
    </Button>
  );
}

function ValueEditForm({
  field,
  onSubmit,
}: {
  field: SimpleField;
  onSubmit: (values: AccountEditValues) => void;
}) {
  const meta = SIMPLE_FIELD_META[field];
  const { session } = useSession();
  const record = session?.record as Record<string, unknown> | null | undefined;

  const defaultValue =
    field === "username"
      ? readString(record?.username) || readString(record?.name)
      : readString(record?.[field]);

  const form = useForm({
    defaultValues: { value: defaultValue },
    validators: {
      onSubmit: accountEditSchemas[field],
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ field, ...value } as AccountEditValues);
    },
  });

  return (
    <View className="gap-6">
      <form.Field name="value">
        {(fieldApi) => (
          <SheetField
            label={meta.label}
            placeholder={meta.placeholder}
            autoCapitalize={meta.autoCapitalize}
            autoComplete={meta.autoComplete}
            autoCorrect={false}
            keyboardType={meta.keyboardType}
            textContentType={meta.textContentType}
            returnKeyType="done"
            value={fieldApi.state.value}
            onChangeText={fieldApi.handleChange}
            onBlur={fieldApi.handleBlur}
            error={getFieldError(fieldApi.state.meta.errors)}
            onSubmitEditing={() => form.handleSubmit()}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton
            isSubmitting={isSubmitting}
            label="Save"
            onPress={() => form.handleSubmit()}
          />
        )}
      </form.Subscribe>
    </View>
  );
}

function PasswordEditForm({
  onSubmit,
}: {
  onSubmit: (values: AccountEditValues) => void;
}) {
  const currentRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: accountEditSchemas.password,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        field: "password",
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
    },
  });

  return (
    <View className="gap-6">
      <form.Field name="currentPassword">
        {(fieldApi) => (
          <SheetPasswordField
            ref={currentRef}
            label="Current Password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="next"
            value={fieldApi.state.value}
            onChangeText={fieldApi.handleChange}
            onBlur={fieldApi.handleBlur}
            error={getFieldError(fieldApi.state.meta.errors)}
            onSubmitEditing={() => newRef.current?.focus()}
          />
        )}
      </form.Field>

      <form.Field name="newPassword">
        {(fieldApi) => (
          <SheetPasswordField
            ref={newRef}
            label="New Password"
            placeholder="Create a new password"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            value={fieldApi.state.value}
            onChangeText={fieldApi.handleChange}
            onBlur={fieldApi.handleBlur}
            error={getFieldError(fieldApi.state.meta.errors)}
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(fieldApi) => (
          <SheetPasswordField
            ref={confirmRef}
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            value={fieldApi.state.value}
            onChangeText={fieldApi.handleChange}
            onBlur={fieldApi.handleBlur}
            error={getFieldError(fieldApi.state.meta.errors)}
            onSubmitEditing={() => form.handleSubmit()}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton
            isSubmitting={isSubmitting}
            label="Update Password"
            onPress={() => form.handleSubmit()}
          />
        )}
      </form.Subscribe>
    </View>
  );
}

function SheetHeader({ field }: { field: AccountEditField }) {
  if (field === "password") {
    return (
      <View className="gap-1">
        <BottomSheet.Title>Change Password</BottomSheet.Title>
        <BottomSheet.Description>
          Choose a strong password you don&apos;t use anywhere else.
        </BottomSheet.Description>
      </View>
    );
  }

  const meta = SIMPLE_FIELD_META[field];
  return (
    <View className="gap-1">
      <BottomSheet.Title>{meta.title}</BottomSheet.Title>
      <BottomSheet.Description>{meta.description}</BottomSheet.Description>
    </View>
  );
}

export function AccountEditSheet({
  field,
  onClose,
  onSubmit,
}: AccountEditSheetProps) {
  const handleSubmitted = async (values: AccountEditValues) => {
    await onSubmit?.(values);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={field !== null}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["95%"]}
          keyboardBehavior="extend"
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 28,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-start justify-between gap-4">
              <View className="min-w-0 flex-1">
                {field ? <SheetHeader field={field} /> : null}
              </View>
              <BottomSheet.Close />
            </View>

            <View className="mt-7">
              {field === "password" ? (
                <PasswordEditForm onSubmit={handleSubmitted} />
              ) : field ? (
                <ValueEditForm
                  key={field}
                  field={field}
                  onSubmit={handleSubmitted}
                />
              ) : null}
            </View>
          </BottomSheetScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
