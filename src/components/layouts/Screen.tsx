import { cn } from "heroui-native";
import { ScrollView, View, type ViewStyle } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
  contentContainerClassName?: string;
  contentContainerStyle?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  /**
   * Skip top content inset so children can draw under the status bar
   * (e.g. mesh / collapsing headers). Caller must pad its own content.
   */
  bleedTop?: boolean;
  testID?: string;
};

/**
 * Screen shell with safe-area insets + themed background.
 * SafeAreaView from safe-area-context does not process Uniwind className,
 * so the themed surface lives on an inner View from react-native (uniwind-patched).
 */
const Screen = ({
  children,
  className,
  scroll = false,
  contentContainerClassName,
  contentContainerStyle,
  edges,
  bleedTop = false,
  testID,
}: ScreenProps) => {
  const { top } = useSafeAreaInsets();
  const scheme = useAppColorScheme();
  // Hex fallback keeps NativeTabs / SafeArea from flashing a mismatched grey.
  const backgroundColor = scheme === "dark" ? "#121214" : "#F7F7F7";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={edges}
      testID={testID}
    >
      <View
        className={cn("flex-1 bg-background", className)}
        style={{
          flex: 1,
          paddingTop: bleedTop ? 0 : top,
          backgroundColor,
        }}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            style={{ flex: 1 }}
            contentContainerClassName={cn(
              "flex-grow",
              contentContainerClassName,
            )}
            contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
};

export default Screen;
