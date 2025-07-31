import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number.",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export const todoSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must be at most 100 characters.",
    }),
  date: z.date({ error: "Select a date" }),
});
