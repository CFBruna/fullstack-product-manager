import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative"),
    category: z.string().min(1, "Category is required"),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
});

export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;
