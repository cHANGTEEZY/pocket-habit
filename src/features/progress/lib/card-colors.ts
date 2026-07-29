/** Mesh-aligned accent colors — paired with Today stat cards where relevant. */
export const CARD_ACCENT = {
  /** Habits / Today ring — lavender purple */
  today: "#8851c2",
  /** Week strip — warm coral (matches Today “Week” card) */
  week: "#db6237",
  /** 30-day consistency — mesh sky, deepened for UI */
  consistency: "#5A9ECF",
  /** Up next — calm sage */
  upNext: "#6B9E78",
  /** Recent activity — soft lilac */
  recent: "#9B7FD4",
} as const;

/** ~10% tint for callout backgrounds. */
export function accentTint(hex: string, alpha = "1A"): string {
  return `${hex}${alpha}`;
}
