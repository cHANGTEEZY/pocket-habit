import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";
import Search from "@/components/Search";
import { logger } from "@/utils/logger";

import { Typography } from "heroui-native/text";

import AddHabitModal from "./components/AddHabitModal";
import CreateFirstHabit from "./components/CreateFirstHabit";

function isTruthyParam(value: string | string[] | undefined): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "true" || raw === "1";
}

export default function Habits() {
  const { openAddHabitForm } = useLocalSearchParams<{
    openAddHabitForm?: string | string[];
  }>();

  const [query, setQuery] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const openFromParams = isTruthyParam(openAddHabitForm);
  const addHabitsModalOpen = manualOpen || openFromParams;

  const handleOpenChange = (open: boolean) => {
    setManualOpen(open);
    if (!open && openFromParams) {
      router.setParams({ openAddHabitForm: undefined });
    }
  };

  const habitsData: unknown[] = [];

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader title="Habits" trailing={<ProfileButton />}>
        <View className="gap-4 px-4">
          <Search
            placeholder="Search habits..."
            value={query}
            onChange={setQuery}
            hasDebounce
            debounceTime={300}
            onSearch={logger.info}
          />
          {query.trim() ? (
            <Typography type="body-sm" className="text-muted">
              Showing results for “{query.trim()}”
            </Typography>
          ) : null}

          <View className="mt-4">
            {habitsData.length === 0 ? (
              <CreateFirstHabit onAction={() => setManualOpen(true)} />
            ) : (
              <View>
                <Typography type="body-sm" className="text-muted">
                  Your habits
                </Typography>
              </View>
            )}
          </View>
        </View>
      </CollapsingLargeHeader>

      <AddHabitModal
        isOpen={addHabitsModalOpen}
        onOpenChange={handleOpenChange}
      />
    </View>
  );
}
