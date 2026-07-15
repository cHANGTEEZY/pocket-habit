import { View, useColorScheme } from "react-native";
import { router } from "expo-router";

import Screen from "@/components/layouts/Screen";
import Container from "@/components/layouts/Container";
import { useUsers } from "@/api/hooks/use-users";
import { authClient, useSession } from "@/lib/auth-client";
import { logger } from "@/utils/logger";

import { Button } from "heroui-native/button";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { Avatar } from "heroui-native/avatar";
import { Alert } from "heroui-native/alert";
import { Surface } from "heroui-native/surface";
import { Uniwind } from "uniwind";

export default function HomeScreen() {
  const { data: session } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
    refetch,
  } = useUsers(undefined, { retry: false });

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/sign-in");
    } catch (err) {
      logger.error("sign-out failed", err);
    }
  };

  const toggleTheme = () => {
    Uniwind.setTheme(isDark ? "light" : "dark");
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <Container className="py-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <Avatar size="md" color="accent">
              <Avatar.Fallback
                textProps={{
                  className: "text-sm font-bold",
                }}
              />
            </Avatar>
            <View>
              <Typography type="body-sm" weight="semibold" className="text-foreground">
                {session?.user.name}
              </Typography>
              <Typography type="body-xs" color="muted">
                {session?.user.email}
              </Typography>
            </View>
          </View>
          <Button variant="ghost" size="sm" onPress={toggleTheme}>
            <Button.Label>{isDark ? "☀️" : "🌙"}</Button.Label>
          </Button>
        </View>

        <Card className="mb-4">
          <Card.Header>
            <Typography type="h5" weight="semibold">
              Welcome
            </Typography>
          </Card.Header>
          <Card.Body className="gap-2">
            <Typography type="body" color="muted">
              You are signed in as{" "}
              <Typography type="body" weight="semibold">
                {session?.user.name}
              </Typography>
            </Typography>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <Typography type="h5" weight="semibold">
              Users API
            </Typography>
          </Card.Header>
          <Card.Body className="gap-3">
            <Typography type="body-sm" color="muted">
              Calls GET /users with the Better Auth cookie from SecureStore.
            </Typography>

            {usersError ? (
              <Alert status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    {usersErr?.message ?? "Failed to load users (is your API running?)"}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            ) : null}

            {usersData?.users?.length ? (
              <View className="gap-2">
                {usersData.users.map((user) => (
                  <Surface key={user.id} variant="secondary" className="rounded-xl px-4 py-3">
                    <Typography type="body" weight="medium">
                      {user.name}
                    </Typography>
                    <Typography type="body-xs" color="muted">
                      {user.email}
                    </Typography>
                  </Surface>
                ))}
              </View>
            ) : !usersLoading && !usersError ? (
              <Typography type="body-sm" color="muted">
                No users returned.
              </Typography>
            ) : null}

            <Button
              variant="outline"
              size="md"
              onPress={() => void refetch()}
            >
              <Button.Label>Refresh users</Button.Label>
            </Button>
          </Card.Body>
        </Card>

        <Button variant="danger" size="lg" onPress={handleSignOut}>
          <Button.Label>Sign out</Button.Label>
        </Button>
      </Container>
    </Screen>
  );
}
