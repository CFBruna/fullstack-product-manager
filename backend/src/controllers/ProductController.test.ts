import { ProductController } from './ProductController';
import { ProductService } from '../services/ProductService';
import { Request, Response, NextFunction } from 'express';
import { productSchema } from '../utils/validators';
import { AppError } from '../utils/AppError';

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

        (productController as any).productService = mockProductService;

        mockReq = {
            params: {},
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe('update', () => {
        it('should update a product successfully', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { name: 'Updated Product' };
            const updatedProduct = { id: 1, name: 'Updated Product', price: 10, category: 'Cat', stock: 5, createdAt: new Date(), updatedAt: new Date(), description: null };

            mockProductService.updateProduct.mockResolvedValue(updatedProduct);

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated product' }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
        });

        it('should throw error for invalid ID', async () => {
            mockReq.params = { id: 'abc' }; // NaN

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should throw validation error for invalid body', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { price: 'invalid' };

            await productController.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as jest.Mock).mock.calls[0][0];
            expect(errorArg.name).toBe('ZodError');
        });
    });
});
