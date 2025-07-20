import { z } from "zod";

export const shopCreateSchema = z.object({
  name: z.string().min(2),
  street: z.string().min(2),
  house_number: z.string().min(1),
  phone: z.string().min(5),
  is_active: z.boolean().optional()
})