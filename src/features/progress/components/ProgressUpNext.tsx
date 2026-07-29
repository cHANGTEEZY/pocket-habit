import { View } from "react-native";

import ProgressCard from "@/components/ProgressCard";
import { Typography } from "heroui-native/text";

import { CARD_ACCENT } from "../lib/card-colors";
import { formatNextDueLabel } from "../lib/schedule";
import type { UpNextItem } from "../lib/stats";
import { upNextCopy } from "../lib/stats";

type ProgressUpNextProps = {
  items: UpNextItem[];
};

export function ProgressUpNext({ items }: ProgressUpNextProps) {
  if (items.length === 0) return null;

  const color = CARD_ACCENT.upNext;

  return (
    <ProgressCard
      leadingTitle="Up next"
      accentColor={color}
      trailingTitle={`${items.length} habit${items.length === 1 ? "" : "s"}`}
      subtitle={upNextCopy(items)}
      separator
      contentClassName="gap-0"
    >
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
          <Typography type="body-sm" style={{ color }}>
            {formatNextDueLabel(date)}
          </Typography>
        </View>
      ))}
    </ProgressCard>
  );
}
