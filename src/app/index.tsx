import { useEffect, useState } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { Redirect } from "expo-router";

import { useSession } from "@/lib/auth-client";

const SESSION_BOOT_TIMEOUT_MS = 3000;

export default function Index() {
  const { data: session, isPending } = useSession();
  const [bootTimedOut, setBootTimedOut] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
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
