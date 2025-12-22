import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { productSchema } from '../utils/validators';
import { AppError } from '../utils/AppError';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    /**
     * Handles creating a new product.
     */
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validatedData = productSchema.parse(req.body);
            const product = await this.productService.createProduct(validatedData);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handles listing all products.
     */
    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const products = await this.productService.listProducts();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handles getting a product by ID.
     */
    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new AppError('Invalid ID', 400);
            }
            const product = await this.productService.getProduct(id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handles updating a product.
     */
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new AppError('Invalid ID', 400);
            }

            const validatedData = productSchema.partial().parse(req.body);
            const product = await this.productService.updateProduct(id, validatedData);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handles deleting a product.
     */
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new AppError('Invalid ID', 400);
            }
            await this.productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}

