import { Uniwind } from "uniwind";

export type AppearancePreference = "system" | "light" | "dark";

export function getAppearanceLabel(preference: AppearancePreference): string {
  switch (preference) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    default:
      return "System";
  }
}

/** Sets the Uniwind theme directly (does not cycle). */
export function setAppearance(preference: AppearancePreference): void {
  Uniwind.setTheme(preference);
}

/**
 * Uniwind's `theme` is the *resolved* light/dark value.
 * When adaptive themes are on, the user preference is System.
 */
export function resolveAppearancePreference(
  theme: string | undefined,
  hasAdaptiveThemes: boolean,
): AppearancePreference {
  if (hasAdaptiveThemes) {
    return "system";
  }
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return "system";
}
