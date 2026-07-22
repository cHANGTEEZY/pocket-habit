import type { HabitRoutine } from "@/api/types";

export type StatusFilter = "active" | "inactive";

export type RoutineFilter = "all" | HabitRoutine;

export type HabitsListFilters = {
  status: StatusFilter;
  routine: RoutineFilter;
  query?: string;
};

/** PocketBase filter for the habits library list. */
export function buildHabitsListFilter({
  status,
  routine,
  query = "",
}: HabitsListFilters): string {
  const parts = [`active = ${status === "active"}`];

  if (routine !== "all") {
    parts.push(`routine = "${routine}"`);
  }

  const trimmed = query.trim();
  if (trimmed) {
    const escaped = trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    parts.push(`name ~ "${escaped}"`);
  }

  return parts.join(" && ");
}
