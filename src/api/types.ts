export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  bio?: string | null;
  image?: string | null;
};

export type UsersListResponse = {
  users: User[];
};

export const HABIT_ROUTINES = [
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

export type HabitRoutine = (typeof HABIT_ROUTINES)[number];

export const HABIT_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

export type HabitFrequency = (typeof HABIT_FREQUENCIES)[number];

export const HABIT_WEEKLY_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type HabitWeeklyDay = (typeof HABIT_WEEKLY_DAYS)[number];

export type Habit = {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  note?: string;
  routine: HabitRoutine;
  /** PB select may return a string or a single-item array. */
  frequency: HabitFrequency[] | HabitFrequency;
  weekly_days: HabitWeeklyDay[] | string;
  monthly_day?: number;
  reminder_enabled: boolean;
  reminder_time: string;
  target_count?: number;
  unit: string;
  active: boolean;
  start_date: string;
  user_id: string[];
  created: string;
  updated: string;
};

export type CreateHabitInput = {
  name: string;
  description: string;
  routine: HabitRoutine;
  frequency: HabitFrequency;
  weeklyDays?: HabitWeeklyDay[];
  monthlyDay?: number;
  startDate: string;
  reminderEnabled: boolean;
  reminderTime: string;
  targetCount?: number;
  unit: string;
};

export type UpdateHabitInput = Partial<CreateHabitInput> & {
  active?: boolean;
};

export type HabitWriteRecord = {
  user_id: string[];
  name: string;
  routine: HabitRoutine;
  frequency: HabitFrequency[];
  weekly_days: HabitWeeklyDay[];
  start_date: string;
  reminder_enabled: boolean;
  reminder_time: string;
  unit: string;
  active: boolean;
  note?: string;
  monthly_day?: number;
  target_count?: number;
};

/** Daily completion record for a habit. */
export type HabitLog = {
  id: string;
  collectionId: string;
  collectionName: string;
  user: string;
  habit: string;
  /** Calendar day YYYY-MM-DD (PocketBase may include time suffix). */
  date: string;
  completed: boolean;
  count?: number;
  completed_at?: string;
  note?: string;
  created: string;
  updated: string;
  expand?: {
    habit?: Habit;
  };
};

export type UpsertHabitLogInput = {
  habitId: string;
  date: string;
  completed?: boolean;
  count?: number;
  completedAt?: string;
};
