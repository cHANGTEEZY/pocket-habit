import { createContext } from "react";

export type TabBarHideReason = "manual" | "scroll";

export const TabBarContext = createContext<{
  setTabBarHidden: (hidden: boolean, reason?: TabBarHideReason) => void;
}>({
  setTabBarHidden: () => {},
});
