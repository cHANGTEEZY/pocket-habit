import { useFocusEffect } from "expo-router";
import { useCallback, useContext } from "react";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import {
  TabBarContext,
  type TabBarHideReason,
} from "@/context/tab-bar-context";

const SCROLL_DELTA_THRESHOLD = 8;
const MIN_SCROLL_Y_TO_HIDE = 32;

type UseTabBarScrollHandlerOptions = {
  /** Optional shared value updated on every scroll frame (e.g. header collapse). */
  scrollY?: SharedValue<number>;
  enabled?: boolean;
};

export function useTabBarScrollHandler({
  scrollY,
  enabled = true,
}: UseTabBarScrollHandlerOptions = {}) {
  const { setTabBarHidden } = useContext(TabBarContext);
  const lastScrollY = useSharedValue(0);
  const isTabBarHidden = useSharedValue(false);

  const setScrollHidden = useCallback(
    (hidden: boolean) => {
      setTabBarHidden(hidden, "scroll" satisfies TabBarHideReason);
    },
    [setTabBarHidden],
  );

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      isTabBarHidden.value = false;
      lastScrollY.value = 0;
      setScrollHidden(false);

      return () => {
        setScrollHidden(false);
      };
    }, [enabled, isTabBarHidden, lastScrollY, setScrollHidden]),
  );

  return useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;

      if (scrollY) {
        scrollY.value = y;
      }

      if (!enabled) {
        lastScrollY.value = y;
        return;
      }

      const delta = y - lastScrollY.value;

      if (y <= MIN_SCROLL_Y_TO_HIDE) {
        if (isTabBarHidden.value) {
          isTabBarHidden.value = false;
          runOnJS(setScrollHidden)(false);
        }
      } else if (delta > SCROLL_DELTA_THRESHOLD && !isTabBarHidden.value) {
        isTabBarHidden.value = true;
        runOnJS(setScrollHidden)(true);
      } else if (delta < -SCROLL_DELTA_THRESHOLD && isTabBarHidden.value) {
        isTabBarHidden.value = false;
        runOnJS(setScrollHidden)(false);
      }

      lastScrollY.value = y;
    },
  });
}
