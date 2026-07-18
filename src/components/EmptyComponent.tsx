import { type ComponentProps, type ReactNode } from "react";
import { useCSSVariable } from "uniwind";

import { HabitDoodle } from "@/assets/icons";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

type EmptyComponentProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  /** Custom illustration. Defaults to HabitDoodle. */
  illustration?: ReactNode;
  /** Leading icon on the primary button. Defaults to Add01. Pass `null` to hide. */
  actionIcon?: IconData | null;
  accessibilityLabel?: string;
};

export default function EmptyComponent({
  title,
  description,
  actionLabel,
  onAction,
  illustration,
  actionIcon = Add01Icon,
  accessibilityLabel,
}: EmptyComponentProps) {
  const accentForeground = useCSSVariable("--color-accent-foreground");
  const iconColor =
    typeof accentForeground === "string" ? accentForeground : "#ffffff";

  return (
    <Card
      className="w-full gap-1"
      style={{ borderCurve: "continuous" }}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel ?? `${title}. ${description}`}
    >
      <Card.Header className="items-center pb-0 pt-2">
        {illustration ?? <HabitDoodle size={128} />}
      </Card.Header>

      <Card.Body className="items-center gap-1.5 px-1 pt-5 pb-1">
        <Card.Title className="text-center text-2xl">{title}</Card.Title>
        <Card.Description className="text-center leading-relaxed">
          {description}
        </Card.Description>
      </Card.Body>

      <Card.Footer className="pt-4">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
        >
          {actionIcon ? (
            <HugeiconsIcon
              icon={actionIcon}
              size={20}
              color={iconColor}
              strokeWidth={1.75}
            />
          ) : null}
          <Button.Label>{actionLabel}</Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
}
