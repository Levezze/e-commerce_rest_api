import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters"}),
  email: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters"}),
});

export const updateSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters"})
    .optional(),
  email: z.string()
    .optional(),
});
