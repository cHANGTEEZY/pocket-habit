import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";

/**
 * Metro / Expo Go host IP (e.g. "192.168.0.172") when running on a device.
 * Used so localhost URLs reach the Mac from a physical phone.
 */
function getDevHostIp(): string | null {
  const candidates: Array<string | null | undefined> = [
    // Most reliable while Metro is serving the bundle
    NativeModules.SourceCode?.scriptURL,
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    (
      Constants as {
        manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } };
      }
    ).manifest2?.extra?.expoGo?.debuggerHost,
    (Constants as { manifest?: { debuggerHost?: string } }).manifest
      ?.debuggerHost,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate) continue;

    // scriptURL: "http://192.168.0.172:8081/index.bundle?..."
    // hostUri / debuggerHost: "192.168.0.172:8081"
    const host = candidate.includes("://")
      ? candidate.split("://")[1]?.split("/")[0]?.split(":")[0]
      : candidate.split(":")[0];

    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return host;
    }
  }

  return null;
}

/**
 * Rewrite localhost so requests reach the machine running PocketBase.
 * - Android emulator → 10.0.2.2
 * - Physical device (Expo Go) → Metro host LAN IP
 */
function resolveForPlatform(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    const isLoopback =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (!isLoopback) {
      return apiUrl.replace(/\/$/, "");
    }

    if (Platform.OS === "android") {
      // Prefer Metro host when available (physical Android); else emulator alias.
      const hostIp = getDevHostIp();
      url.hostname = hostIp ?? "10.0.2.2";
      return url.toString().replace(/\/$/, "");
    }

    if (Platform.OS !== "web") {
      const hostIp = getDevHostIp();
      if (hostIp) {
        url.hostname = hostIp;
        return url.toString().replace(/\/$/, "");
      }
    }
  } catch {
    return apiUrl.replace(/\/$/, "");
  }

  return apiUrl.replace(/\/$/, "");
}

/**
 * PocketBase base URL (no trailing slash). Default local port is 8090.
 * Set `EXPO_PUBLIC_POCKETBASE_URL` in `.env` (see `.env.example`).
 *
 * Serve with `--http=0.0.0.0:8090` so devices on your LAN can connect.
 */
export function getPocketBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_POCKETBASE_URL;
  const fromExtra = Constants.expoConfig?.extra
    ?.EXPO_PUBLIC_POCKETBASE_URL as string | undefined;
  const apiUrl = fromEnv || fromExtra;

  if (!apiUrl) {
    if (__DEV__) {
      const hostIp = getDevHostIp();
      const fallback = hostIp
        ? `http://${hostIp}:8090`
        : Platform.OS === "android"
          ? "http://10.0.2.2:8090"
          : "http://127.0.0.1:8090";
      console.warn(
        `[env] EXPO_PUBLIC_POCKETBASE_URL is not set. Using dev fallback: ${fallback}`,
      );
      return fallback;
    }

    console.warn(
      "[env] EXPO_PUBLIC_POCKETBASE_URL is not set. Requests will fail.",
    );
    return "";
  }

  return resolveForPlatform(apiUrl);
}
