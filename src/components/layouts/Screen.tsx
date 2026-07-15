import { cn } from "heroui-native";
import { ScrollView, type ViewStyle } from "react-native";
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
    <SafeAreaView
      className={cn("flex-1 bg-background", className)}
      // Explicit styles so layout still works if uniwind className fails to apply.
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={edges}
      testID={testID}
    >
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
    </SafeAreaView>
  );
};

export default Screen;
