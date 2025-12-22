import { ProductRepository } from '../repositories/ProductRepository';
import { CreateProductInput, UpdateProductInput } from '../utils/validators';
import { AppError } from '../utils/AppError';
import { Product } from '@prisma/client';

export class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository?: ProductRepository) {
        this.productRepository = productRepository || new ProductRepository();
    }

    /**
     * Creates a new product.
     * @param data - The product data.
     * @returns The created product.
     */
    async createProduct(data: CreateProductInput): Promise<Product> {
        return this.productRepository.create(data);
    }

    /**
     * Retrieves all products.
     * @returns List of products.
     */
    async listProducts(): Promise<Product[]> {
        return this.productRepository.findAll();
    }

    /**
     * Retrieves a single product by ID.
     * @param id - The product ID.
     * @throws AppError if product not found.
     * @returns The found product.
     */
    async getProduct(id: number): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        return product;
    }

    /**
     * Updates a product.
     * @param id - The product ID.
     * @param data - The update data.
     * @throws AppError if product not found.
     * @returns The updated product.
     */
    async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
        // Ensure product exists
        await this.getProduct(id);
        return this.productRepository.update(id, data);
    }

    /**
     * Deletes a product.
     * @param id - The product ID.
     * @throws AppError if product not found.
     * @returns The deleted product.
     */
    async deleteProduct(id: number): Promise<Product> {
        // Ensure product exists
        await this.getProduct(id);
        return this.productRepository.delete(id);
    }
}
