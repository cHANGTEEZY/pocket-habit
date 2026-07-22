import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useCSSVariable } from "uniwind";

import CollapsingLargeHeader from "@/components/layouts/CollapsingLargeHeader";
import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";
import Search from "@/components/Search";

import {
  Add01Icon,
  Cancel01Icon,
  HomeIcon,
  Moon02Icon,
  MoonsetIcon,
  SunIcon,
  SunriseIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Button } from "heroui-native/button";
import { Typography } from "heroui-native/text";

import { useHabits, useHasHabits } from "@/api";
import type { HabitRoutine } from "@/api/types";

import AddHabitModal from "./components/AddHabitModal";
import CreateFirstHabit from "./components/CreateFirstHabit";
import HabitFilterPills from "./components/HabitFilterPills";
import HabitsList from "./components/HabitsList";
import type { RoutineFilter, StatusFilter } from "./lib/filter-habits";

function isTruthyParam(value: string | string[] | undefined): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "true" || raw === "1";
}

const ROUTINE_PILLS: {
  value: HabitRoutine;
  label: string;
  icon: typeof SunriseIcon;
}[] = [
  { value: "morning", label: "Morning", icon: SunriseIcon },
  { value: "afternoon", label: "Afternoon", icon: SunIcon },
  { value: "evening", label: "Evening", icon: MoonsetIcon },
  { value: "night", label: "Night", icon: Moon02Icon },
];

export default function Habits() {
  const { openAddHabitForm } = useLocalSearchParams<{
    openAddHabitForm?: string | string[];
  }>();

  const foreground = useCSSVariable("--color-foreground");
  const addIconColor = typeof foreground === "string" ? foreground : "#1C1C1E";

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [routineFilter, setRoutineFilter] = useState<RoutineFilter>("all");
  const [manualOpen, setManualOpen] = useState(false);

  const listFilters = useMemo(
    () => ({
      status: statusFilter,
      routine: routineFilter,
      query: debouncedQuery,
    }),
    [statusFilter, routineFilter, debouncedQuery],
  );

  const {
    data: habits,
    isPending,
    isError,
    error,
    isFetching,
  } = useHabits(listFilters);
  const {
    data: hasAnyHabits = false,
    isPending: isHasAnyPending,
    isError: isHasAnyError,
  } = useHasHabits();

  const openFromParams = isTruthyParam(openAddHabitForm);
  const addHabitsModalOpen = manualOpen || openFromParams;

  const habitList = habits ?? [];
  const isLoading = isPending || isHasAnyPending;
  const showEmptyLibrary =
    !isLoading && !isError && !isHasAnyError && !hasAnyHabits;

  const handleOpenChange = (open: boolean) => {
    setManualOpen(open);
    if (!open && openFromParams) {
      router.setParams({ openAddHabitForm: undefined });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsingLargeHeader
        title="Habits"
        trailing={<ProfileButton />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="gap-4 ">
          <Search
            placeholder="Search habits..."
            value={query}
            onChange={setQuery}
            hasDebounce
            debounceTime={300}
            onSearch={setDebouncedQuery}
            className="mx-4"
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pl-4">
              <HabitFilterPills
                iconName={HomeIcon}
                text="All"
                isSelected={routineFilter === "all"}
                onSelectedChange={() => setRoutineFilter("all")}
              />
              {ROUTINE_PILLS.map(({ value, label, icon }) => (
                <HabitFilterPills
                  key={value}
                  iconName={icon}
                  text={label}
                  isSelected={routineFilter === value}
                  onSelectedChange={() => setRoutineFilter(value)}
                />
              ))}
            </View>
          </ScrollView>

          <View className="flex-row gap-2 pl-4">
            <HabitFilterPills
              iconName={Tick02Icon}
              text="Active"
              isSelected={statusFilter === "active"}
              onSelectedChange={() => setStatusFilter("active")}
            />
            <HabitFilterPills
              iconName={Cancel01Icon}
              text="Inactive"
              isSelected={statusFilter === "inactive"}
              onSelectedChange={() => setStatusFilter("inactive")}
            />
          </View>

          <View className="px-4">
            {query.trim() ? (
              <Typography type="body-sm" className="text-muted">
                Showing results for “{query.trim()}”
              </Typography>
            ) : null}

            {/* {!isLoading && !isError && hasAnyHabits && habitList.length > 0 ? (
              <Typography type="body-sm" className="text-muted">
                {habitList.length} {habitList.length === 1 ? "habit" : "habits"}
                {isFetching ? " · Updating…" : ""}
              </Typography>
            ) : null} */}

            <View className="mt-2 gap-4">
              {isLoading ? (
                <Typography type="body-sm" color="muted" className="px-1">
                  Loading habits…
                </Typography>
              ) : isError ? (
                <Typography type="body-sm" className="px-1 text-danger">
                  {error?.message ?? "Couldn’t load habits."}
                </Typography>
              ) : showEmptyLibrary ? (
                <CreateFirstHabit onAction={() => setManualOpen(true)} />
              ) : (
                <>
                  <HabitsList habits={habitList} />
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    accessibilityRole="button"
                    accessibilityLabel="Add habit"
                    onPress={() => setManualOpen(true)}
                  >
                    <HugeiconsIcon
                      icon={Add01Icon}
                      size={20}
                      color={addIconColor}
                      strokeWidth={1.75}
                    />
                    <Button.Label>Add habit</Button.Label>
                  </Button>
                </>
              )}
            </View>
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
