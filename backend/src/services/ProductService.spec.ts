import { ProductService } from './ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { AppError } from '../utils/AppError';

jest.mock('../repositories/ProductRepository');

describe('ProductService', () => {
    let productService: ProductService;
    let productRepositoryMock: jest.Mocked<ProductRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        productRepositoryMock = new ProductRepository() as jest.Mocked<ProductRepository>;

        productService = new ProductService(productRepositoryMock);
    });

    it('should create a product successfully', async () => {
        const productData = {
            name: 'Test Product',
            price: 100,
            category: 'Test',
            stock: 10,
            description: 'Optional desc'
        };

        const expectedProduct = {
            id: 1,
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        } as any;

        productRepositoryMock.create.mockResolvedValue(expectedProduct);

        const result = await productService.createProduct(productData);

        expect(result).toEqual(expectedProduct);
        expect(productRepositoryMock.create).toHaveBeenCalledWith(productData);
    });

    it('should throw 404 when getting non-existent product', async () => {
        productRepositoryMock.findById.mockResolvedValue(null);

        await expect(productService.getProduct(999))
            .rejects
            .toBeInstanceOf(AppError);

        await expect(productService.getProduct(999))
            .rejects
            .toHaveProperty('statusCode', 404);
    });
});
