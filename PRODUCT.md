# Product

## Register

product

## Platform

adaptive

## Users

The primary users are people doing focused personal or work productivity — tasks, notes, tracking — who reach for the app in short, frequent sessions and expect it to feel native whether they're on iOS or Android. Today the codebase also serves a second audience: the developer building on top of this Expo base, so structure, conventions, and defaults should stay clean enough to grow into a real product without a rewrite.

## Product Purpose

A cross-platform productivity app built on a shared Expo/React Native foundation that ships to iOS and Android from one codebase. It exists to let someone capture and act on their work quickly, with a foundation (auth, data layer, theming) already solid so the product surface can stay the focus. Success is a person completing their core task in seconds with no friction, on either platform, and trusting that their data is there when they come back.

## Positioning

A productivity app that feels genuinely premium and native on both iOS and Android — not a lowest-common-denominator cross-platform shell. Every screen earns trust through precision and restraint rather than decoration.

## Brand Personality

Premium, refined, understated. The voice is calm, precise, and confident — it does the work quietly and never shouts. Polish shows in the details (spacing, motion, states), not in ornament. It should feel like a well-made tool a discerning person is glad to use daily.

## Anti-references

Not a generic AI-slop starter-template look (default card grids, eyebrow labels, gradient text). Not childish or over-gamified (mascots, confetti-by-default, playful-at-the-expense-of-clarity). Not cold, corporate, or sterile. Not a cluttered, dense enterprise dashboard that buries the task under chrome.

## Design Principles

- **Earn trust through precision.** Alignment, spacing, and state handling are the brand; sloppy details read as an untrustworthy tool.
- **Restraint over decoration.** Premium comes from what's removed. Add an element only when it serves the task.
- **Native on both platforms.** Respect platform expectations for gestures, navigation, and feel; adaptive means it belongs on each OS, not identical everywhere.
- **The task is the hero.** Chrome recedes; the user's content and next action are always the most prominent thing on screen.
- **Fast, always-ready.** Instant perceived response, graceful loading and empty states, and data that persists — friction is the enemy of a daily tool.

## Accessibility & Inclusion

Target WCAG 2.1 AA: body text at ≥4.5:1 contrast, large text at ≥3:1, and touch targets of at least 44×44pt. Honor reduced-motion preferences with a crossfade or instant fallback for every animation, and respect system light/dark and dynamic text sizing.
