import { useState } from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";

import Screen from "@/components/layouts/Screen";
import Container from "@/components/layouts/Container";
import KeyboardAvoidingWrapper from "@/components/layouts/KeyboardAvoidingWrapper";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/utils/logger";

import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Typography } from "heroui-native/text";
import { Alert } from "heroui-native/alert";
import { Avatar } from "heroui-native/avatar";
import { Card } from "heroui-native/card";
import { Separator } from "heroui-native/separator";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Sign up failed");
        return;
      }

      router.replace("/home");
    } catch (err) {
      logger.error("sign-up failed", err);
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = Boolean(name && email && password);

  return (
    <Screen scroll edges={["bottom"]}>
      <KeyboardAvoidingWrapper keyboardVerticalOffset={-50}>
        <Container className="justify-center py-12">
          <View className="items-center mb-8 gap-3">
            <Avatar size="lg" color="accent">
              <Avatar.Fallback
                textProps={{ className: "text-xl font-bold" }}
              />
            </Avatar>
            <View className="items-center gap-1">
              <Typography type="h2" weight="bold" className="text-foreground">
                Create account
              </Typography>
              <Typography type="body" color="muted">
                Get started in seconds
              </Typography>
            </View>
          </View>

          <Card className="mx-2">
            <Card.Body className="gap-4">
              {error ? (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Sign up failed</Alert.Title>
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
                  Full name
                </Typography>
                <Input
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                />
              </View>

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
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                variant="primary"
                size="lg"
                isDisabled={loading || !canSubmit}
                onPress={handleSignUp}
              >
                <Button.Label>
                  {loading ? "Creating account..." : "Create account"}
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
              Already have an account?{" "}
            </Typography>
            <Link href="/sign-in" asChild>
              <Button variant="ghost" size="sm">
                <Button.Label className="text-primary">Sign in</Button.Label>
              </Button>
            </Link>
          </View>
        </Container>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}
