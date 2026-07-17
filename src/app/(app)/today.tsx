import Screen from "@/components/layouts/Screen";
import Today from "@/features/today";

export default function TodayScreen() {
  return (
    <Screen edges={["left", "right"]} bleedTop>
      <Today />
    </Screen>
  );
}
