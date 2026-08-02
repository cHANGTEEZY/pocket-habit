import { View } from "react-native";

import { SkeletonHabitList } from "@/components/skeletons/skeleton-habit-list";
import { SkeletonStatCard } from "@/components/skeletons/skeleton-stat-card";

/**
 * Full-page loading state for Today — two stat cards (ring + weekly bars)
 * above the grouped habit list, mirroring the real layout exactly.
 */
export default function TodaySkeleton() {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading your day"
      accessibilityLiveRegion="polite"
    >
      <View className="mb-3 mt-3 px-4">
        <SkeletonStatCard graphic="ring" index={0} />
      </View>
      <View className="mb-3 px-4">
        <SkeletonStatCard graphic="bars" index={1} />
      </View>
      <View className="mb-8 mt-5 gap-3 px-4">
        <SkeletonHabitList
          sections={[
            { label: "Morning", rows: 3 },
            { label: "Evening", rows: 2 },
          ]}
        />
      </View>
    </View>
  );
}
