import { z } from "zod";

export const ACCOUNT_FIELDS = ["email", "phone", "username", "password"] as const;
export type AccountEditField = (typeof ACCOUNT_FIELDS)[number];

export const MIN_PASSWORD = 8;

export const emailEditSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
});

export const phoneEditSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "Enter your phone number.")
    .regex(/^\+?[0-9][0-9\s().-]{6,18}$/, "Enter a valid phone number."),
});

export const usernameEditSchema = z.object({
  value: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be less than 30 characters.")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Only letters, numbers, dots, dashes and underscores.",
    ),
});

export const passwordEditSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(1, "Create a new password.")
      .min(MIN_PASSWORD, `Use at least ${MIN_PASSWORD} characters.`),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const accountEditSchemas = {
  email: emailEditSchema,
  phone: phoneEditSchema,
  username: usernameEditSchema,
  password: passwordEditSchema,
} as const;

export type AccountEditValues =
  | { field: "email"; value: string }
  | { field: "phone"; value: string }
  | { field: "username"; value: string }
  | { field: "password"; currentPassword: string; newPassword: string };
