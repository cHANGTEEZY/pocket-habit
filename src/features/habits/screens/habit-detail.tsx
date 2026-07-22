import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";

import { Typography } from "heroui-native/text";

import { useHabit } from "@/api";

import HabitEditor from "../components/HabitEditor";

function resolveHabitId(id: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(id) ? id[0] : id;
  return raw?.trim() || undefined;
}

export default function HabitDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const habitId = resolveHabitId(idParam);

  const { data: habit, isPending, isError, error } = useHabit(habitId ?? "");

  const title = habit?.name ?? "Habit";

  return (
    <View className="flex-1 bg-background">
      <CollapsedLargeHeader title={title} leading={<GoBackButton />}>
        <View className="mt-2 gap-4 px-4 pb-8">
          {!habitId ? (
            <Typography type="body-sm" className="text-danger">
              This habit link is invalid.
            </Typography>
          ) : isPending ? (
            <Typography type="body-sm" color="muted">
              Loading habit…
            </Typography>
          ) : isError ? (
            <Typography type="body-sm" className="text-danger">
              {error?.message ?? "Couldn’t load this habit."}
            </Typography>
          ) : habit ? (
            <HabitEditor habit={habit} />
          ) : null}
        </View>
      </CollapsedLargeHeader>
    </View>
  );
}
