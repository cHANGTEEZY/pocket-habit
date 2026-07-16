import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useCSSVariable } from "uniwind";

import { useAuth } from "@/api/hooks/use-auth";

const SESSION_BOOT_TIMEOUT_MS = 3000;

export default function Index() {
  const { session, isPending } = useAuth();
  const [bootTimedOut, setBootTimedOut] = useState(false);
  const backgroundColor = useCSSVariable("--color-background");

  useEffect(() => {
    const timer = setTimeout(() => setBootTimedOut(true), SESSION_BOOT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  const waitingForSession = isPending && !bootTimedOut;

  if (waitingForSession) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            typeof backgroundColor === "string" ? backgroundColor : undefined,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/sign-in" />;
}
