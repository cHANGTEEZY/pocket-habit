import { cn } from "heroui-native";
import { ScrollView, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
  contentContainerClassName?: string;
  contentContainerStyle?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
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
  testID,
}: ScreenProps) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges} testID={testID}>
      <View className={cn("flex-1 bg-background", className)} style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView
            className="flex-1"
            style={{ flex: 1 }}
            contentContainerClassName={cn("flex-grow", contentContainerClassName)}
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
