import { View } from "react-native";

import Container from "@/components/layouts/Container";

import { Typography } from "heroui-native/text";

import AddFirstHabit from "./components/AddFirstHabit";

export default function Today() {
  return (
    <Container className="px-6">
      <View className="mb-6 gap-1.5">
        <Typography type="h1" weight="semibold" className="text-foreground">
          Today
        </Typography>
        <Typography type="body" color="muted">
          Your habits for this day.
        </Typography>
      </View>
      <View>
        <AddFirstHabit />
      </View>
    </Container>
  );
}
