import { Link } from "expo-router";
import { forwardRef, useState } from "react";
import { Pressable, type TextInput, View } from "react-native";

import { EyeIcon, EyeOffIcon, FocusGlyph } from "@/components/icons";

import { Description } from "heroui-native/description";
import { FieldError } from "heroui-native/field-error";
import { Input, type InputProps } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextField } from "heroui-native/text-field";
import { Typography } from "heroui-native/text";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="gap-5">
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl bg-accent"
        style={{ borderCurve: "continuous" }}
        accessible={false}
      >
        <FocusGlyph size={26} />
      </View>
      <View className="gap-1.5">
        <Typography type="h1" weight="semibold" className="text-foreground">
          {title}
        </Typography>
        <Typography type="body" color="muted">
          {subtitle}
        </Typography>
      </View>
    </View>
  );
}

type AuthFieldProps = InputProps & {
  label: string;
  error?: string | null;
  description?: string;
  isRequired?: boolean;
};

export const AuthField = forwardRef<TextInput, AuthFieldProps>(
  ({ label, error, description, isRequired, ...inputProps }, ref) => {
    return (
      <TextField isInvalid={Boolean(error)} isRequired={isRequired}>
        <Label>{label}</Label>
        <Input ref={ref} {...inputProps} />
        {description && !error ? (
          <Description>{description}</Description>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </TextField>
    );
  },
);

AuthField.displayName = "AuthField";

export const AuthPasswordField = forwardRef<TextInput, AuthFieldProps>(
  ({ label, error, description, isRequired, ...inputProps }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <TextField isInvalid={Boolean(error)} isRequired={isRequired}>
        <Label>{label}</Label>
        <View className="w-full justify-center">
          <Input
            ref={ref}
            className="pr-12"
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
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
        {description && !error ? (
          <Description>{description}</Description>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </TextField>
    );
  },
);

AuthPasswordField.displayName = "AuthPasswordField";

type AuthFooterProps = {
  prompt: string;
  actionLabel: string;
  href: "/sign-in" | "/sign-up";
};

export function AuthFooter({ prompt, actionLabel, href }: AuthFooterProps) {
  return (
    <View className="mt-auto flex-row items-center justify-center pt-8 pb-2">
      <Typography type="body" color="muted">
        {prompt}{" "}
      </Typography>
      <Link href={href} asChild>
        <Pressable
          hitSlop={8}
          accessibilityRole="link"
          className="min-h-11 justify-center"
        >
          <Typography type="body" weight="semibold" className="text-accent">
            {actionLabel}
          </Typography>
        </Pressable>
      </Link>
    </View>
  );
}
