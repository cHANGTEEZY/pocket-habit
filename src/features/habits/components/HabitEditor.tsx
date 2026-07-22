import { router } from "expo-router";
import { View } from "react-native";

import type { Habit } from "@/api/types";

import { HabitDetailSummary } from "./HabitDetailSummary";
import HabitForm from "./HabitForm";
import { habitToFormValues } from "../lib/habit-form-mapper";

type HabitEditorProps = {
  habit: Habit;
  onSaved?: () => void;
};

export default function HabitEditor({ habit, onSaved }: HabitEditorProps) {
  const handleSuccess = () => {
    onSaved?.();
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View className="gap-6">
      <HabitDetailSummary habit={habit} />
      <HabitForm
        mode="edit"
        habitId={habit.id}
        initialValues={habitToFormValues(habit)}
        initialActive={habit.active}
        onSuccess={handleSuccess}
      />
    </View>
  );
}
