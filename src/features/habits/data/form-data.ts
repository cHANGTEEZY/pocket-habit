import {
  Calendar03Icon,
  Coffee01Icon,
  Moon02Icon,
  RepeatIcon,
  SleepingIcon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";

export const ROUTINES = [
  {
    value: "morning" as const,
    title: "Morning",
    description: "Before noon",
    icon: Sun03Icon,
    iconBackground: "#FF9500",
  },
  {
    value: "afternoon" as const,
    title: "Afternoon",
    description: "Midday focus",
    icon: Coffee01Icon,
    iconBackground: "#FFCC00",
    iconColor: "#1C1C1E",
  },
  {
    value: "evening" as const,
    title: "Evening",
    description: "Wind-down hours",
    icon: Moon02Icon,
    iconBackground: "#5856D6",
  },
  {
    value: "night" as const,
    title: "Night",
    description: "Before sleep",
    icon: SleepingIcon,
    iconBackground: "#636366",
  },
];

export const FREQUENCIES = [
  {
    value: "daily" as const,
    title: "Daily",
    description: "Every day",
    icon: RepeatIcon,
    iconBackground: "#34C759",
  },
  {
    value: "weekly" as const,
    title: "Weekly",
    description: "Pick specific days",
    icon: Calendar03Icon,
    iconBackground: "#007AFF",
  },
  {
    value: "monthly" as const,
    title: "Monthly",
    description: "Once each month",
    icon: Calendar03Icon,
    iconBackground: "#AF52DE",
  },
];
