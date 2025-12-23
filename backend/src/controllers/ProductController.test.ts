import { ProductController } from './ProductController';
import { ProductService } from '../services/ProductService';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('../services/ProductService');

describe('ProductController', () => {
    let productController: ProductController;
    let mockProductService: jest.Mocked<ProductService>;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockProductService = new ProductService() as jest.Mocked<ProductService>;
        productController = new ProductController();

        // Inject the mocked service specifically into the controller instance
        (productController as any).productService = mockProductService;

        mockReq = {
            params: {},
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis() as unknown as any,
            json: jest.fn() as unknown as any,
            send: jest.fn() as unknown as any
        };
        mockNext = jest.fn();
    });

    describe('create', () => {
        it('should create a product successfully', async () => {
            const newProduct = { name: 'New Product', price: 50, category: 'Test', stock: 10, description: 'Desc' };
            // Validator transforms 'New Product' -> 'New product'
            const createdProduct = { id: 1, ...newProduct, name: 'New product', category: 'Test', description: 'Desc', createdAt: new Date(), updatedAt: new Date() };

            mockReq.body = newProduct;
            mockProductService.createProduct.mockResolvedValue(createdProduct);

            await productController.create(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.createProduct).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New product',
                category: 'Test',
                description: 'Desc'
            }));
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(createdProduct);
        });

        it('should throw validation error for invalid body', async () => {
            mockReq.body = { name: 'Invalid', price: 'not-a-number' };

            await productController.create(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg: any = (mockNext as jest.Mock).mock.calls[0][0];
            expect(errorArg.name).toBe('ZodError');
        });
    });

    describe('getAll', () => {
        it('should return a list of products', async () => {
            const products = [
                { id: 1, name: 'P1', price: 10, category: 'C1', stock: 1, createdAt: new Date(), updatedAt: new Date(), description: null },
                { id: 2, name: 'P2', price: 20, category: 'C2', stock: 2, createdAt: new Date(), updatedAt: new Date(), description: null },
            ];
            mockProductService.listProducts.mockResolvedValue(products);

            await productController.getAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.listProducts).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(products);
        });

        it('should return empty list if no products found', async () => {
            mockProductService.listProducts.mockResolvedValue([]);

            await productController.getAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith([]);
        });
    });

    describe('getById', () => {
        it('should return a product by ID', async () => {
            mockReq.params = { id: '1' };
            const product = { id: 1, name: 'P1', price: 10, category: 'C1', stock: 1, createdAt: new Date(), updatedAt: new Date(), description: null };
            mockProductService.getProduct.mockResolvedValue(product);

            await productController.getById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.getProduct).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(product);
        });

        it('should throw error for invalid ID', async () => {
            mockReq.params = { id: 'abc' };

            await productController.getById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
        });
    });

    describe('update', () => {
        it('should update a product successfully', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { name: 'Updated Product' };
            // Validator transforms 'Updated Product' -> 'Updated product'
            const updatedProduct = { id: 1, name: 'Updated product', price: 10, category: 'Cat', stock: 5, createdAt: new Date(), updatedAt: new Date(), description: null };

            mockProductService.updateProduct.mockResolvedValue(updatedProduct);

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated product' }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
        });

        it('should throw error for invalid ID', async () => {
            mockReq.params = { id: 'abc' };

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should throw validation error for invalid body', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { price: 'invalid' };

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg: any = (mockNext as jest.Mock).mock.calls[0][0];
            expect(errorArg.name).toBe('ZodError');
        });
    });

    describe('delete', () => {
        it('should delete a product successfully', async () => {
            mockReq.params = { id: '1' };
            const deletedProduct = { id: 1, name: 'Deleted', price: 0, category: 'Del', stock: 0, createdAt: new Date(), updatedAt: new Date(), description: null };
            mockProductService.deleteProduct.mockResolvedValue(deletedProduct);

            await productController.delete(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should throw error for invalid ID', async () => {
            mockReq.params = { id: 'abc' };

            await productController.delete(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
        });
    });
});
