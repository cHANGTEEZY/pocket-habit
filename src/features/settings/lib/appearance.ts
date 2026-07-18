import { Uniwind } from "uniwind";

export type AppearancePreference = "system" | "light" | "dark";

const ORDER: AppearancePreference[] = ["system", "light", "dark"];

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

export function cycleAppearance(
  current: AppearancePreference,
): AppearancePreference {
  const index = ORDER.indexOf(current);
  const next = ORDER[(index + 1) % ORDER.length] ?? "system";
  Uniwind.setTheme(next);
  return next;
}

export function resolveAppearancePreference(
  theme: string | undefined,
  hasAdaptiveThemes: boolean,
): AppearancePreference {
  if (!hasAdaptiveThemes && (theme === "light" || theme === "dark")) {
    return theme;
  }
  if (theme === "light" || theme === "dark" || theme === "system") {
    return theme;
  }
  return "system";
}
