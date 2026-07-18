import { BottomSheet } from "heroui-native";
import { View } from "react-native";

type AddHabitFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddHabitForm({
  isOpen,
  onOpenChange,
}: AddHabitFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["100%", "70%", "95%"]}
          enableDynamicSizing={false}
          enableOverDrag={false}
          contentContainerClassName="h-full px-5 pt-2"
        >
          <View className="mb-4 flex-row items-center justify-between">
            <BottomSheet.Title>Add habit</BottomSheet.Title>
            <BottomSheet.Close />
          </View>
          <BottomSheet.Description>
            Name a habit you want to build. You can refine the details later.
          </BottomSheet.Description>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
