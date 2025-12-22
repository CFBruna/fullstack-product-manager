import { PrismaClient, Product } from '@prisma/client';
import { CreateProductInput, UpdateProductInput } from '../utils/validators';

const prisma = new PrismaClient();

export class ProductRepository {
    /**
     * Creates a new product in the database.
     * @param data - The product data to create.
     * @returns The created product.
     */
    async create(data: CreateProductInput): Promise<Product> {
        return prisma.product.create({
            data,
        });
    }

    /**
     * Retrieves all products from the database.
     * @returns A list of products.
     */
    async findAll(): Promise<Product[]> {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Finds a product by its unique ID.
     * @param id - The ID of the product.
     * @returns The product if found, or null.
     */
    async findById(id: number): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
        });
    }

    /**
     * Updates an existing product.
     * @param id - The ID of the product to update.
     * @param data - The data to update.
     * @returns The updated product.
     */
    async update(id: number, data: UpdateProductInput): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    /**
     * Deletes a product by its ID.
     * @param id - The ID of the product to delete.
     * @returns The deleted product.
     */
    async delete(id: number): Promise<Product> {
        return prisma.product.delete({
            where: { id },
        });
    }
}
