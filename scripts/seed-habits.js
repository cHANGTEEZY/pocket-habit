#!/usr/bin/env node
/**
 * Seed the Habits collection with every form-field scenario.
 *
 * Covers:
 *   - routines: morning / afternoon / evening / night
 *   - frequencies: daily / weekly / monthly
 *   - start dates: today / past / future
 *   - weekly: weekdays, weekends, single day (today)
 *   - monthly: today's day-of-month + another day
 *   - reminders: on (with HH:mm) / off
 *   - optional note, target_count, unit
 *   - (inactive skipped: PocketBase rejects active=false on required bool)
 *
 * Usage:
 *   npm run pocketbase:seed
 *   npm run pocketbase:seed -- --clear
 *   SEED_EMAIL=you@example.com SEED_PASSWORD=password123 npm run pocketbase:seed
 *
 * Requires PocketBase running: npm run pocketbase
 */
const fs = require("node:fs");
const path = require("node:path");
const PocketBase = require("pocketbase").default;

const ROOT = path.resolve(__dirname, "..");
const HABITS_COLLECTION = "Habits";

const DEFAULT_EMAIL = "seed@pocket-habit.local";
const DEFAULT_PASSWORD = "seedseed123";
const DEFAULT_NAME = "Seed User";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

function parseArgs(argv) {
  return {
    clear: argv.includes("--clear"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function addDays(iso, days) {
  const date = new Date(`${iso}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function weekdayName(date = new Date()) {
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][date.getDay()];
}

function pocketBaseError(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  const parts = [error.message || "Request failed"];
  if (error.status) parts.push(`status=${error.status}`);
  if (error.response) {
    try {
      parts.push(JSON.stringify(error.response));
    } catch {
      // ignore
    }
  }
  return parts.join(" | ");
}

function buildSeedHabits({ today, yesterday, tomorrow, todayWeekday, monthDay }) {
  /** @type {Array<Record<string, unknown> & { _label: string }>} */
  return [
    {
      _label: "daily · morning · starts today · reminder on · target+unit+note",
      name: "Drink water",
      note: "Eight glasses throughout the morning.",
      routine: "morning",
      frequency: ["daily"],
      weekly_days: [],
      start_date: today,
      reminder_enabled: true,
      reminder_time: "07:30",
      target_count: 8,
      unit: "glasses",
      active: true,
    },
    {
      _label: "daily · afternoon · starts today · reminder off · no target",
      name: "Walk outside",
      note: "A short walk after lunch.",
      routine: "afternoon",
      frequency: ["daily"],
      weekly_days: [],
      start_date: today,
      reminder_enabled: false,
      reminder_time: "",
      unit: "",
      active: true,
    },
    {
      _label: "daily · evening · started in past · reminder on",
      name: "Read 10 pages",
      note: "Any book counts for this streak.",
      routine: "evening",
      frequency: ["daily"],
      weekly_days: [],
      start_date: yesterday,
      reminder_enabled: true,
      reminder_time: "20:00",
      target_count: 10,
      unit: "pages",
      active: true,
    },
    {
      _label: "daily · night · starts in future · reminder off",
      name: "No phone in bed",
      note: "Begins tomorrow night as a hard cut-off.",
      routine: "night",
      frequency: ["daily"],
      weekly_days: [],
      start_date: tomorrow,
      reminder_enabled: false,
      reminder_time: "",
      unit: "",
      active: true,
    },
    {
      _label: "weekly · weekdays · morning · reminder on",
      name: "Deep work block",
      note: "Ninety focused minutes before noon.",
      routine: "morning",
      frequency: ["weekly"],
      weekly_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      start_date: today,
      reminder_enabled: true,
      reminder_time: "09:00",
      target_count: 1,
      unit: "session",
      active: true,
    },
    {
      _label: "weekly · weekends · afternoon · reminder off",
      name: "Long run",
      note: "Easy pace, keep it enjoyable.",
      routine: "afternoon",
      frequency: ["weekly"],
      weekly_days: ["saturday", "sunday"],
      start_date: yesterday,
      reminder_enabled: false,
      reminder_time: "",
      target_count: 5,
      unit: "km",
      active: true,
    },
    {
      _label: `weekly · only ${todayWeekday} · evening · reminder on`,
      name: "Weekly review",
      note: "Capture wins and next-week focus.",
      routine: "evening",
      frequency: ["weekly"],
      weekly_days: [todayWeekday],
      start_date: today,
      reminder_enabled: true,
      reminder_time: "18:30",
      unit: "",
      active: true,
    },
    {
      _label: `monthly · day ${monthDay} (today) · morning · reminder on`,
      name: "Budget check-in",
      note: "Review spending and savings once a month.",
      routine: "morning",
      frequency: ["monthly"],
      weekly_days: [],
      monthly_day: monthDay,
      start_date: today,
      reminder_enabled: true,
      reminder_time: "08:00",
      target_count: 1,
      unit: "check",
      active: true,
    },
    {
      _label: "monthly · day 15 · night · reminder off",
      name: "Network backup",
      note: "Confirm cloud backup finished successfully.",
      routine: "night",
      frequency: ["monthly"],
      weekly_days: [],
      monthly_day: 15,
      start_date: addDays(today, -20),
      reminder_enabled: false,
      reminder_time: "",
      unit: "",
      active: true,
    },
    {
      _label: "daily · no note · reminder off · minimal fields",
      name: "Make bed",
      routine: "morning",
      frequency: ["daily"],
      weekly_days: [],
      start_date: today,
      reminder_enabled: false,
      reminder_time: "",
      unit: "",
      active: true,
    },
    {
      _label: "daily · unit only · no target · reminder off",
      name: "Journal entry",
      note: "One short paragraph before sleep.",
      routine: "night",
      frequency: ["daily"],
      weekly_days: [],
      start_date: today,
      reminder_enabled: false,
      reminder_time: "",
      unit: "entry",
      active: true,
    },
    {
      _label: "weekly · all seven days · reminder on · target only",
      name: "Meditate",
      note: "Sit quietly, even for two minutes.",
      routine: "morning",
      frequency: ["weekly"],
      weekly_days: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      start_date: today,
      reminder_enabled: true,
      reminder_time: "06:15",
      target_count: 1,
      unit: "",
      active: true,
    },
  ];
}

async function ensureUser(pb, email, password, name) {
  try {
    return await pb.collection("users").authWithPassword(email, password);
  } catch (error) {
    const status = error?.status;
    if (status !== 400 && status !== 404) {
      throw new Error(`Sign-in failed: ${pocketBaseError(error)}`);
    }
  }

  console.log(`Creating seed user ${email}...`);
  try {
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name,
      emailVisibility: true,
    });
  } catch (error) {
    // User may already exist with a different password.
    throw new Error(
      `Could not create seed user. If it already exists, set SEED_PASSWORD to the correct password.\n${pocketBaseError(error)}`,
    );
  }

  return pb.collection("users").authWithPassword(email, password);
}

async function clearHabits(pb, userId) {
  console.log("Clearing existing habits for seed user...");

  const filters = [
    `user_id.id ?= "${userId}"`,
    `user_id ?= "${userId}"`,
  ];

  let habits = [];
  let lastError = null;

  for (const filter of filters) {
    try {
      habits = await pb.collection(HABITS_COLLECTION).getFullList({ filter });
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError && habits.length === 0) {
    try {
      const all = await pb.collection(HABITS_COLLECTION).getFullList();
      habits = all.filter((habit) => {
        const owners = habit.user_id;
        if (Array.isArray(owners)) return owners.includes(userId);
        return owners === userId;
      });
    } catch (inner) {
      throw new Error(
        `Could not list habits to clear them. Restart PocketBase so migrations apply (Habits list rules were fixed).\n${pocketBaseError(lastError)}\n${pocketBaseError(inner)}`,
      );
    }
  }

  for (const habit of habits) {
    await pb.collection(HABITS_COLLECTION).delete(habit.id);
  }
  console.log(`Deleted ${habits.length} habit(s).`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Seed Habits with every form scenario.

Options:
  --clear   Delete this user's existing habits before seeding
  --help    Show this help

Env:
  EXPO_PUBLIC_POCKETBASE_URL   PocketBase URL (default http://127.0.0.1:8090)
  SEED_EMAIL                   User email (default ${DEFAULT_EMAIL})
  SEED_PASSWORD                User password (default ${DEFAULT_PASSWORD})
  SEED_NAME                    Display name (default ${DEFAULT_NAME})`);
    return;
  }

  const baseUrl = (
    process.env.EXPO_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"
  ).replace(/\/$/, "");
  const email = process.env.SEED_EMAIL || DEFAULT_EMAIL;
  const password = process.env.SEED_PASSWORD || DEFAULT_PASSWORD;
  const name = process.env.SEED_NAME || DEFAULT_NAME;

  const pb = new PocketBase(baseUrl);
  pb.autoCancellation(false);

  console.log(`PocketBase: ${baseUrl}`);
  const auth = await ensureUser(pb, email, password, name);
  const userId = auth.record.id;
  console.log(`Signed in as ${auth.record.email || email} (${userId})`);

  if (args.clear) {
    await clearHabits(pb, userId);
  }

  const today = isoDate();
  const seeds = buildSeedHabits({
    today,
    yesterday: addDays(today, -1),
    tomorrow: addDays(today, 1),
    todayWeekday: weekdayName(),
    monthDay: new Date().getDate(),
  });

  console.log(`Seeding ${seeds.length} habits...`);
  let created = 0;

  for (const seed of seeds) {
    const { _label, ...fields } = seed;
    const payload = {
      ...fields,
      user_id: [userId],
    };

    try {
      const record = await pb.collection(HABITS_COLLECTION).create(payload);
      created += 1;
      console.log(`  ✓ ${_label}`);
      console.log(`      id=${record.id}  name="${record.name}"`);
    } catch (error) {
      console.error(`  ✗ ${_label}`);
      console.error(`      ${pocketBaseError(error)}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nDone. Created ${created}/${seeds.length} habits for ${email}.`);
  console.log("Sign into the app with that email/password to see them.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
