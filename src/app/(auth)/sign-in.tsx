import { Link, router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import Container from "@/components/layouts/Container";
import KeyboardAvoidingWrapper from "@/components/layouts/KeyboardAvoidingWrapper";
import Screen from "@/components/layouts/Screen";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/utils/logger";

import { Alert } from "heroui-native/alert";
import { Avatar } from "heroui-native/avatar";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Input } from "heroui-native/input";
import { Separator } from "heroui-native/separator";
import { Typography } from "heroui-native/text";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message ?? "Sign in failed");
        return;
      }

      router.replace("/home");
    } catch (err) {
      logger.error("sign-in failed", err);
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <KeyboardAvoidingWrapper keyboardVerticalOffset={-50}>
        <Container className="justify-center py-12">
          <View className="items-center mb-8 gap-3">
            <Avatar size="lg" color="accent">
              <Avatar.Fallback textProps={{ className: "text-xl font-bold" }} />
            </Avatar>
            <View className="items-center gap-1">
              <Typography type="h2" weight="bold" className="text-foreground">
                Welcome back
              </Typography>
              <Typography type="body" color="muted">
                Sign in to continue
              </Typography>
            </View>
          </View>

          <Card className="mx-2">
            <Card.Body className="gap-4">
              {error ? (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Sign in failed</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Content>
                </Alert>
              ) : null}

              <View className="gap-1">
                <Typography
                  type="body-sm"
                  weight="medium"
                  className="text-foreground"
                >
                  Email
                </Typography>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View className="gap-1">
                <Typography
                  type="body-sm"
                  weight="medium"
                  className="text-foreground"
                >
                  Password
                </Typography>
                <Input
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                variant="primary"
                size="lg"
                isDisabled={loading || !email || !password}
                onPress={handleSignIn}
              >
                <Button.Label>
                  {loading ? "Signing in..." : "Sign in"}
                </Button.Label>
              </Button>
            </Card.Body>
          </Card>

          <View className="flex-row items-center justify-center mt-6 gap-3 px-2">
            <Separator orientation="horizontal" className="flex-1" />
            <Typography type="body-xs" color="muted">
              or
            </Typography>
            <Separator orientation="horizontal" className="flex-1" />
          </View>

          <View className="items-center mt-4">
            <Typography type="body" color="muted">
              Don't have an account?{" "}
            </Typography>
            <Link href="/sign-up" asChild>
              <Button variant="ghost" size="sm">
                <Button.Label className="text-primary">Create one</Button.Label>
              </Button>
            </Link>
          </View>
        </Container>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}
