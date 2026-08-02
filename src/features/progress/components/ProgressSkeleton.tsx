import { View } from "react-native";

import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { SkeletonCircle, SkeletonText } from "@/components/skeletons/skeleton";

/**
 * Loading state for the Progress report — week, consistency, up-next and
 * recent-activity cards in the same order and rhythm as the live page.
 */
export default function ProgressSkeleton() {
  return (
    <View
      className="gap-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Loading progress"
      accessibilityLiveRegion="polite"
    >
      <SkeletonCard index={0}>
        <View className="flex-row">
          {Array.from({ length: 7 }, (_, i) => (
            <View key={i} className="flex-1 items-center gap-2">
              <SkeletonText width="w-6" className="h-3" />
              <SkeletonCircle className="size-9" />
            </View>
          ))}
        </View>
      </SkeletonCard>

      <SkeletonCard index={1}>
        <View className="mb-3 flex-row gap-6">
          <View className="flex-1 gap-1.5">
            <SkeletonText width="w-24" className="h-3" />
            <SkeletonText width="w-16" className="h-8" />
          </View>
          <View className="flex-1 gap-1.5">
            <SkeletonText width="w-20" className="h-3" />
            <SkeletonText width="w-16" className="h-8" />
          </View>
        </View>
        <View className="items-center pt-1">
          <SkeletonCircle className="size-[120px]" />
        </View>
      </SkeletonCard>

      <SkeletonCard index={2} headerTrailing={<SkeletonText width="w-12" className="h-3" />}>
        <View className="gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <View
              key={i}
              className="flex-row items-center justify-between py-2"
            >
              <SkeletonText width="w-1/2" className="h-4" />
              <SkeletonText width="w-10" className="h-3" />
            </View>
          ))}
        </View>
      </SkeletonCard>

      <SkeletonCard index={3}>
        <View className="gap-1">
          {Array.from({ length: 4 }, (_, i) => (
            <View key={i} className="flex-row items-center gap-3 py-2">
              <SkeletonCircle className="size-10 shrink-0" />
              <View className="min-w-0 flex-1 gap-1.5">
                <SkeletonText width="w-2/3" className="h-4" />
                <SkeletonText width="w-1/3" className="h-3" />
              </View>
            </View>
          ))}
        </View>
      </SkeletonCard>
    </View>
  );
}
