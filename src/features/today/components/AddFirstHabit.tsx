import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useCSSVariable } from "uniwind";

import { HabitDoodle } from "@/assets/icons";

import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";

export default function AddFirstHabit() {
  const accentForeground = useCSSVariable("--color-accent-foreground");
  const iconColor =
    typeof accentForeground === "string" ? accentForeground : "#ffffff";

  return (
    <Card
      className="w-full gap-1"
      style={{ borderCurve: "continuous" }}
      accessibilityRole="summary"
      accessibilityLabel="No habits yet. Add your first habit to get started."
    >
      <Card.Header className="items-center pb-0 pt-2">
        <HabitDoodle size={128} />
      </Card.Header>

      <Card.Body className="items-center gap-1.5 px-1 pt-5 pb-1">
        <Card.Title className="text-center">Start your first habit</Card.Title>
        <Card.Description className="text-center leading-relaxed">
          Add one small thing you want to do today. Checking in is enough to
          begin.
        </Card.Description>
      </Card.Body>

      <Card.Footer className="pt-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          accessibilityRole="button"
          accessibilityLabel="Add habit"
        >
          <HugeiconsIcon
            icon={Add01Icon}
            size={20}
            color={iconColor}
            strokeWidth={1.75}
          />
          <Button.Label>Add habit</Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
}
