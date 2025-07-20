import { z } from "zod";

const priceSchema = z.coerce.number().positive().or(z.string().regex(/^\d+$/).transform(Number))

const booleanSchema = z.union([
  z.boolean(),
  z.string().transform(val => val === 'true'),
  z.literal('true').transform(() => true),
  z.literal('false').transform(() => false)
])

export const paginationSchema = z.object({
    query: z.object({
        page: z.string()
        // .regex(/^\d+$/)
        .optional()
        .default("1")
        .transform(Number)
        .refine(n => n > 0),
        
        limit: z.string()
        // .regex(/^\d+$/)
        .optional()
        .default("10")
        .transform(Number)
        .refine(n => n > 0 && n <= 100),
    })
})

export const categoriesSchema = z.object({
    category: z.enum(['flowers', 'gifts'])
})

export const productCreateSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional().nullable(),
    price: priceSchema,
    remains:  z.coerce.number().int().nonnegative(),
    is_available: booleanSchema.optional(),
    category_name: z.enum(['flowers', 'gifts']),
    image: z.file().optional()
})


export const productUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  price: priceSchema.optional(),
  remains: z.coerce.number().int().nonnegative().optional(),
  is_available: booleanSchema.optional(),
  category_name: z.enum(['flowers', 'gifts']).optional()
})
.partial()
.refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});


export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type PaginationQuery = z.infer<typeof paginationSchema>["query"]
export type CategoriesQuery = z.infer<typeof categoriesSchema>
export type productCreateInput = z.infer<typeof productCreateSchema>