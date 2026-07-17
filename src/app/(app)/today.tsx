import Screen from "@/components/layouts/Screen";
import Today from "@/features/today";

export default function TodayScreen() {
  return (
    <Screen scroll edges={["top", "left", "right"]}>
      <Today />
    </Screen>
  );
}
