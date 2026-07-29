import { View } from "react-native";

import { Typography } from "heroui-native/text";

import { formatNextDueLabel } from "../lib/schedule";
import type { UpNextItem } from "../lib/stats";

type ProgressUpNextProps = {
  items: UpNextItem[];
};

export function ProgressUpNext({ items }: ProgressUpNextProps) {
  if (items.length === 0) return null;

  return (
    <View
      className="gap-3 rounded-4xl bg-surface px-4 py-5"
      style={{ borderCurve: "continuous" }}
    >
      <Typography type="h5" weight="semibold" className="text-foreground">
        Up next
      </Typography>
      <View className="gap-1">
        {items.map(({ habit, date }) => (
          <View
            key={habit.id}
            className="flex-row items-center justify-between py-2.5"
          >
            <Typography
              type="body"
              weight="medium"
              className="min-w-0 flex-1 pr-3 text-foreground"
              numberOfLines={1}
            >
              {habit.name}
            </Typography>
            <Typography type="body-sm" className="text-muted">
              {formatNextDueLabel(date)}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
}
