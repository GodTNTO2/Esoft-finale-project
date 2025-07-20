import { z } from "zod";

export const registerSchema = z.object({
  phone: z.string()
    .min(10)
    .max(20)
    .regex(/^[0-9]+$/),
  password: z.string()
    .min(8)
    .max(100)
    .trim(),
  name: z.string()
    .min(2)
    .max(100)
    .trim(),
  role: z.enum(["user", "moderator", "admin"]).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const loginSchema = z.object({
  phone: z.string()
    .min(10)
    .max(20)
    .regex(/^[0-9]+$/),
  password: z.string()
    .min(8)
    .max(100)
    .trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;