import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { Typography } from "heroui-native/text";

import type { Habit, HabitRoutine } from "@/api/types";
import HabitPill from "@/features/today/components/HabitPill";

import { groupByRoutine, ROUTINE_LABEL } from "../lib/group-by-routine";

type HabitsListProps = {
  habits: Habit[];
};

type SectionHeaderItem = {
  type: "section";
  id: string;
  routine: HabitRoutine;
};

type HabitRowItem = {
  type: "habit";
  id: string;
  habit: Habit;
};

type HabitsListItem = SectionHeaderItem | HabitRowItem;

function buildListItems(habits: Habit[]): HabitsListItem[] {
  const sections = groupByRoutine(habits);
  const items: HabitsListItem[] = [];

  for (const { routine, habits: sectionHabits } of sections) {
    items.push({ type: "section", id: `section-${routine}`, routine });
    for (const habit of sectionHabits) {
      items.push({ type: "habit", id: habit.id, habit });
    }
  }

  return items;
}

export default function HabitsList({ habits }: HabitsListProps) {
  const listItems = useMemo(() => buildListItems(habits), [habits]);

  const renderListItem = useCallback(
    ({ item, index }: ListRenderItemInfo<HabitsListItem>) => {
      if (item.type === "section") {
        return (
          <View
            className={`px-1 pb-2.5 ${index === 0 ? "" : "pt-6"}`}
            accessibilityRole="header"
          >
            <Typography type="body-sm" weight="medium" color="muted">
              {ROUTINE_LABEL[item.routine]}
            </Typography>
          </View>
        );
      }

      return (
        <View className="pb-2.5">
          <HabitPill habit={item.habit} variant="library" />
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: HabitsListItem) => item.id, []);

  const getItemType = useCallback(
    (item: HabitsListItem) => item.type,
    [],
  );

  if (habits.length === 0) {
    return (
      <View
        className="rounded-4xl bg-surface px-4 py-5"
        style={{ borderCurve: "continuous" }}
      >
        <Typography type="body" weight="semibold" className="text-foreground">
          No habits match
        </Typography>
        <Typography
          type="body-sm"
          color="muted"
          className="mt-1 leading-relaxed"
        >
          Try a different filter or search term.
        </Typography>
      </View>
    );
  }

  return (
    <FlashList
      data={listItems}
      renderItem={renderListItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}
