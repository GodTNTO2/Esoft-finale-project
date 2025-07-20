import { z } from "zod";

export const orderItemSchema = z.object({
    product_id: z.number().positive(),
    quantity: z.number().positive(),
    special_instructions: z.string().optional()
})

export const orderCreateSchema = z.object({
    shop_id: z.number().positive().optional(),
    delivery_address_id: z.number().positive(),
    recipient_name: z.string().min(2),
    recipient_phone: z.string().min(5),
    delivery_date: z.string().datetime(),
    delivery_time_slot: z.string(),
    delivery_instructions: z.string().optional(),
    gift_message: z.string().optional(),
    items: z.array(orderItemSchema).min(1)
})

export const orderStatusSchema = z.object({
    status: z.enum(['processing', 'delivered', 'finished', 'cancelled'])
})