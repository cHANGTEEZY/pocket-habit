export type CongratsMessage = {
  headline: string;
  subtext: string;
};

export const CONGRATS_MESSAGES: CongratsMessage[] = [
  {
    headline: "You're killing it",
    subtext: "Every habit on today's list is checked off. The whole day, done.",
  },
  {
    headline: "All done",
    subtext: "Nothing left on today's list. Enjoy the rest of your day.",
  },
  {
    headline: "Perfect day",
    subtext: "You showed up for every habit today had scheduled. Nice work.",
  },
  {
    headline: "Day complete",
    subtext: "Every habit is checked off. That's a win, however you measure it.",
  },
];

/** Pick a message deterministically per calendar day so it rotates. */
export function pickCongratsMessage(now = new Date()): CongratsMessage {
  return CONGRATS_MESSAGES[now.getDate() % CONGRATS_MESSAGES.length];
}
