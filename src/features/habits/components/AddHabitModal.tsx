import { View } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "heroui-native";

import HabitForm, { type HabitFormValues } from "./HabitForm";

type AddHabitModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: HabitFormValues) => void;
};

export default function AddHabitModal({
  isOpen,
  onOpenChange,
  onSubmit,
}: AddHabitModalProps) {
  const queryClient = useQueryClient();

  const handleSuccess = (values: HabitFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <QueryClientProvider client={queryClient}>
          <BottomSheet.Content
            snapPoints={["92%", "75%", "92%"]}
            enableDynamicSizing={false}
            enableOverDrag={false}
            contentContainerClassName="h-full px-0"
          >
            <View className="mb-3 flex-row items-center justify-between px-5 pt-2">
              <BottomSheet.Title className="text-lg font-semibold">
                Add habit
              </BottomSheet.Title>
              <BottomSheet.Close />
            </View>
            <BottomSheet.Description className="mb-5 px-5">
              Name a habit you want to build. Details stay optional until you
              need them.
            </BottomSheet.Description>

            <BottomSheetScrollView
              contentContainerClassName="gap-0 px-4 pb-safe-offset-6"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <HabitForm onSuccess={handleSuccess} />
            </BottomSheetScrollView>
          </BottomSheet.Content>
        </QueryClientProvider>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
