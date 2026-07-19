import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { FieldError } from "heroui-native/field-error";

import { FieldLabel } from "./field-label";

type HabitFormFieldProps = {
  label?: string;
  /** Marks the field as required (asterisk + Required badge). */
  required?: boolean;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad" | "numbers-and-punctuation";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  returnKeyType?: "done" | "next" | "default";
};

/** Borderless text field sized for inset grouped list rows. */
export function HabitFormField({
  label,
  required = false,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  multiline = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  maxLength,
  returnKeyType = "done",
}: HabitFormFieldProps) {
  const muted = useCSSVariable("--color-muted");
  const placeholderColor = typeof muted === "string" ? muted : "#8A8A8F";

  return (
    <View className="gap-1 px-4 py-3">
      {label ? <FieldLabel required={required}>{label}</FieldLabel> : null}
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        accessibilityHint={required ? "Required" : "Optional"}
        className={
          multiline
            ? "min-h-[72px] py-1 text-[17px] leading-6 text-foreground"
            : "py-1 text-[17px] text-foreground"
        }
        style={{ textAlignVertical: multiline ? "top" : "center" }}
      />
      {error ? <FieldError isInvalid>{error}</FieldError> : null}
    </View>
  );
}
