import * as z from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Name must be less than 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be less than 500 characters."),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ProfileFormInput = z.input<typeof profileFormSchema>;
