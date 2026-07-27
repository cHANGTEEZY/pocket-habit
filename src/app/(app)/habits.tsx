import Screen from "@/components/layouts/Screen";
import Habits from "@/features/habits";

export default function HabitsScreen() {
  return (
    <Screen edges={["left", "right"]} bleedTop>
      <Habits />
    </Screen>
  );
}
