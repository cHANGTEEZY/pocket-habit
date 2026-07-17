import { View } from "react-native";

import Container from "@/components/layouts/Container";

import AddFirstHabit from "./components/AddFirstHabit";
import TodayHeader from "./components/TodayHeader";

export default function Today() {
  return (
    <Container>
      <TodayHeader isEmpty />
      <View>
        <AddFirstHabit />
      </View>
    </Container>
  );
}
