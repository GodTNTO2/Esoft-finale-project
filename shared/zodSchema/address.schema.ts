import { z } from "zod";

export const addressCreateSchema = z.object({
    street: z.string().min(2),
    house_number: z.string().min(1),
    apartment_number: z.string().min(1),
    entrance: z.string().optional().nullable(),
    floor: z.string().optional().nullable(),
    is_primary: z.boolean().optional()
})

export const addressUpdateSchema = z.object({
    street: z.string().min(2).optional(),
    house_number: z.string().min(1).optional(),
    apartment_number: z.string().min(1).optional(),
    entrance: z.string().optional().nullable(),
    floor: z.string().optional().nullable(),
    is_primary: z.boolean().optional()
})