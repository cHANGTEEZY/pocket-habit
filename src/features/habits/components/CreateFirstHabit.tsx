import EmptyComponent from "@/components/EmptyComponent";

export default function CreateFirstHabit({
  onAction,
}: {
  onAction: () => void;
}) {
  return (
    <EmptyComponent
      title="Create your first habit"
      description="Build a small routine you can stick with. One habit is enough to get started."
      actionLabel="Add habit"
      accessibilityLabel="No habits yet. Create your first habit to get started."
      onAction={onAction}
    />
  );
}
