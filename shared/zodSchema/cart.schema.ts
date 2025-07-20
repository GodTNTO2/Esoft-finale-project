import { z } from "zod";

export const cartItemSchema = z.object({
    productId: z.number().positive(),
    quantity: z.number().positive()
});