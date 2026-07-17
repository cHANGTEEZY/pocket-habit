import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { type TextInput, View } from "react-native";

import Container from "@/components/layouts/Container";
import KeyboardAvoidingWrapper from "@/components/layouts/KeyboardAvoidingWrapper";
import Screen from "@/components/layouts/Screen";
import { pb } from "@/lib/pocketbase";
import { logger } from "@/utils/logger";

import { Alert } from "heroui-native/alert";
import { Button } from "heroui-native/button";
import { Spinner } from "heroui-native/spinner";

import {
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthPasswordField,
} from "./components";
import { getFieldError } from "./field-error";
import { signInSchema } from "./schemas";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const { getPocketBaseUrl } = await import("@/utils/env");
        pb.baseUrl = getPocketBaseUrl();
        await pb
          .collection("users")
          .authWithPassword(value.email.trim(), value.password);
        router.replace("/today");
      } catch (err) {
        logger.error("sign-in failed", err);
        setError(
          err instanceof Error
            ? "That email or password doesn't match. Try again."
            : "Sign in failed. Please try again.",
        );
      }
    },
  });

  return (
    <Screen scroll edges={[]}>
      <KeyboardAvoidingWrapper keyboardVerticalOffset={-50}>
        <Container className="pt-14 pb-4">
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to pick up where you left off."
          />

          <View className="mt-10 gap-5">
            {error ? (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Couldn&apos;t sign in</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert>
            ) : null}

            <form.Field name="email">
              {(field) => (
                <AuthField
                  label="Email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={getFieldError(field.state.meta.errors)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <AuthPasswordField
                  ref={passwordRef}
                  label="Password"
                  placeholder="Enter your password"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={getFieldError(field.state.meta.errors)}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={() => form.handleSubmit()}
                />
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-1"
                  isDisabled={isSubmitting}
                  onPress={() => form.handleSubmit()}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Button.Label>Sign in</Button.Label>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </View>

          <AuthFooter
            prompt="New here?"
            actionLabel="Create an account"
            href="/sign-up"
          />
        </Container>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}
