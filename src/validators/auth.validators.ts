import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  passwsord: z.string(),
});

export const registerSchema = z.object({
  username: z.string(),
  email: z.string(),
  passwsord: z.string(),
});
