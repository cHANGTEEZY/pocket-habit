import { useColorScheme } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

/** Resolved light/dark scheme (Uniwind theme when locked, else system). */
export function useAppColorScheme(): "light" | "dark" {
  const systemScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();

  if (hasAdaptiveThemes) {
    return systemScheme === "dark" ? "dark" : "light";
  }

  return theme === "dark" ? "dark" : "light";
}

export function useToggleAppTheme() {
  const isDark = useAppColorScheme() === "dark";

  return () => {
    Uniwind.setTheme(isDark ? "light" : "dark");
  };
}
