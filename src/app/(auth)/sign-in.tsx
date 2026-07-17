import { router } from "expo-router";
import { useRef, useState } from "react";
import { type TextInput, View } from "react-native";

import {
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthPasswordField,
} from "@/components/auth";
import Container from "@/components/layouts/Container";
import KeyboardAvoidingWrapper from "@/components/layouts/KeyboardAvoidingWrapper";
import Screen from "@/components/layouts/Screen";
import { pb } from "@/lib/pocketbase";
import { logger } from "@/utils/logger";

import { Alert } from "heroui-native/alert";
import { Button } from "heroui-native/button";
import { Spinner } from "heroui-native/spinner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = "Enter your email.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Enter your password.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignIn = async () => {
    setError(null);
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      const { getPocketBaseUrl } = await import("@/utils/env");
      pb.baseUrl = getPocketBaseUrl();
      if (__DEV__) {
        console.log(`[sign-in] pocketbase=${pb.baseUrl}`);
      }
      await pb.collection("users").authWithPassword(email.trim(), password);
      router.replace("/home");
    } catch (err) {
      console.log("sign-in failed", err);
      logger.error("sign-in failed", err);
      setError(
        err instanceof Error
          ? "That email or password doesn't match. Try again."
          : "Sign in failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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

            <AuthField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (fieldErrors.email) {
                  setFieldErrors((e) => ({ ...e, email: undefined }));
                }
              }}
              error={fieldErrors.email}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <AuthPasswordField
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (fieldErrors.password) {
                  setFieldErrors((e) => ({ ...e, password: undefined }));
                }
              }}
              error={fieldErrors.password}
              editable={!loading}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
            />

            <Button
              variant="primary"
              size="lg"
              className="mt-1"
              isDisabled={loading}
              onPress={handleSignIn}
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Button.Label>Sign in</Button.Label>
              )}
            </Button>
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
