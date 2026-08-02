import { View } from "react-native";

import { SkeletonHabitList } from "@/components/skeletons/skeleton-habit-list";
import { Skeleton } from "@/components/skeletons/skeleton";

/**
 * Loading state for the Habits list — sits below the live search bar and
 * filter pills, mirroring the grouped habit rows and the Add habit button.
 */
export default function HabitsSkeleton() {
  return (
    <View
      className="gap-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Loading habits"
      accessibilityLiveRegion="polite"
    >
      <SkeletonHabitList
        sections={[
          { label: "Morning", rows: 3 },
          { label: "Evening", rows: 3 },
        ]}
      />
      <Skeleton className="h-12 w-full rounded-full" />
    </View>
  );
}
