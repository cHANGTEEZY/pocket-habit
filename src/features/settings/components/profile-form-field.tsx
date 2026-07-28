import { forwardRef } from "react";
import { TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { FieldError } from "heroui-native/field-error";
import { Typography } from "heroui-native/text";

type ProfileFormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "name" | "email" | "off";
  keyboardType?: "default" | "email-address";
  textContentType?: "name" | "emailAddress" | "none";
  returnKeyType?: "done" | "next" | "default";
  onSubmitEditing?: () => void;
  multiline?: boolean;
  maxLength?: number;
};

/** Inset row: muted label left, editable value right (settings / profile style). */
export const ProfileFormField = forwardRef<TextInput, ProfileFormFieldProps>(
  function ProfileFormField(
    {
      label,
      value,
      onChangeText,
      onBlur,
      placeholder,
      error,
      autoCapitalize = "sentences",
      autoComplete,
      keyboardType = "default",
      textContentType,
      returnKeyType = "done",
      onSubmitEditing,
      multiline = false,
      maxLength,
    },
    ref,
  ) {
    const muted = useCSSVariable("--color-muted");
    const placeholderColor = typeof muted === "string" ? muted : "#8A8A8F";

    if (multiline) {
      return (
        <View className="gap-1 px-4 py-3.5">
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            multiline
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            textAlignVertical="top"
            accessibilityLabel={label}
            className="min-h-[96px] py-1 text-[17px] leading-6 text-foreground"
          />
          {error ? <FieldError isInvalid>{error}</FieldError> : null}
        </View>
      );
    }

    return (
      <View className="gap-1 px-4 py-3.5">
        <View className="flex-row items-center gap-3">
          <Typography
            type="body"
            className="w-[72px] shrink-0 text-muted"
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {label}
          </Typography>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType={textContentType}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            maxLength={maxLength}
            accessibilityLabel={label}
            className="min-w-0 flex-1 py-0 text-right text-[17px] text-foreground"
          />
        </View>
        {error ? <FieldError isInvalid>{error}</FieldError> : null}
      </View>
    );
  },
);
