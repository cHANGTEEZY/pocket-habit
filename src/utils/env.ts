import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Dev fallback when env is missing.
 * - Android emulator: 10.0.2.2 maps to the host machine's localhost
 * - iOS simulator / web: localhost works
 * - Physical device: set EXPO_PUBLIC_API_URL to your machine's LAN IP
 */
function getDevFallbackApiUrl(): string {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  return "http://localhost:3000";
}

/**
 * On Android emulators, localhost/127.0.0.1 points at the emulator,
 * not the host machine. Rewrite to 10.0.2.2 so EXPO_PUBLIC_API_URL=http://localhost:3000 works.
 */
function resolveForPlatform(apiUrl: string): string {
  if (Platform.OS !== "android") {
    return apiUrl;
  }

  try {
    const url = new URL(apiUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      url.hostname = "10.0.2.2";
      return url.toString().replace(/\/$/, "");
    }
  } catch {
    return apiUrl.replace(/\/$/, "");
  }

  return apiUrl.replace(/\/$/, "");
}

/**
 * Public API / Better Auth base URL (no trailing slash).
 * Set `EXPO_PUBLIC_API_URL` in `.env` (see `.env.example`).
 */
export function getApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  const fromExtra = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL as
    | string
    | undefined;

  const apiUrl = fromEnv || fromExtra;

  if (!apiUrl) {
    if (__DEV__) {
      const fallback = getDevFallbackApiUrl();
      console.warn(
        `[env] EXPO_PUBLIC_API_URL is not set. Using dev fallback: ${fallback}`,
      );
      return fallback;
    }

    console.warn(
      "[env] EXPO_PUBLIC_API_URL is not set. API and auth requests will fail.",
    );
    return "";
  }

  return resolveForPlatform(apiUrl);
}
