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
const MIN_PASSWORD = 8;

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const clearFieldError = (key: "name" | "email" | "password") => {
    setFieldErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = () => {
    const next: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      next.name = "Enter your name.";
    }
    if (!email.trim()) {
      next.email = "Enter your email.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Create a password.";
    } else if (password.length < MIN_PASSWORD) {
      next.password = `Use at least ${MIN_PASSWORD} characters.`;
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignUp = async () => {
    setError(null);
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await pb.collection("users").create({
        email: email.trim(),
        password,
        passwordConfirm: password,
        name: name.trim(),
      });
      await pb.collection("users").authWithPassword(email.trim(), password);
      router.replace("/home");
    } catch (err) {
      logger.error("sign-up failed", err);
      setError(
        err instanceof Error
          ? "We couldn't create your account. That email may already be in use."
          : "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={["top", "bottom"]}>
      <KeyboardAvoidingWrapper keyboardVerticalOffset={-50}>
        <Container className="pt-14 pb-4">
          <AuthHeader
            title="Create your account"
            subtitle="Set up your workspace in a few seconds."
          />

          <View className="mt-10 gap-5">
            {error ? (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Couldn&apos;t create account</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert>
            ) : null}

            <AuthField
              label="Name"
              placeholder="Your name"
              value={name}
              onChangeText={(v) => {
                setName(v);
                clearFieldError("name");
              }}
              error={fieldErrors.name}
              editable={!loading}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <AuthField
              ref={emailRef}
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearFieldError("email");
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
              placeholder="Create a password"
              description={`At least ${MIN_PASSWORD} characters.`}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                clearFieldError("password");
              }}
              error={fieldErrors.password}
              editable={!loading}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
            />

            <Button
              variant="primary"
              size="lg"
              className="mt-1"
              isDisabled={loading}
              onPress={handleSignUp}
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Button.Label>Create account</Button.Label>
              )}
            </Button>
          </View>

          <AuthFooter
            prompt="Already have an account?"
            actionLabel="Sign in"
            href="/sign-in"
          />
        </Container>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}
