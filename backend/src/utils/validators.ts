import { z } from 'zod';

const formatText = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const productSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .transform(formatText),
    description: z.string()
        .optional()
        .transform(val => val ? formatText(val) : val),
    price: z.number()
        .nonnegative("Price cannot be negative")
        .refine(val => Number.isFinite(val), "Price must be a finite number"),
    category: z.string()
        .trim()
        .min(1, "Category is required")
        .transform(formatText),
    stock: z.number()
        .int()
        .nonnegative("Stock cannot be negative")
        .refine(val => Number.isFinite(val), "Stock must be a finite number"),
});

export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;
