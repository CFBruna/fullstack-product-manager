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

    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        category: 'Test',
        stock: 10,
        description: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const input = { name: 'Test Product', price: 100, category: 'Test', stock: 10, description: 'Desc' };
            productRepositoryMock.create.mockResolvedValue(mockProduct);

            const result = await productService.createProduct(input);

            expect(result).toEqual(mockProduct);
            expect(productRepositoryMock.create).toHaveBeenCalledWith(input);
        });
    });

    describe('listProducts', () => {
        it('should return all products', async () => {
            productRepositoryMock.findAll.mockResolvedValue([mockProduct]);

            const result = await productService.listProducts();

            expect(result).toEqual([mockProduct]);
            expect(productRepositoryMock.findAll).toHaveBeenCalled();
        });
    });

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            productRepositoryMock.findById.mockResolvedValue(mockProduct);

            const result = await productService.getProduct(1);

            expect(result).toEqual(mockProduct);
            expect(productRepositoryMock.findById).toHaveBeenCalledWith(1);
        });

        it('should throw 404 if product not found', async () => {
            productRepositoryMock.findById.mockResolvedValue(null);

            await expect(productService.getProduct(1))
                .rejects
                .toEqual(expect.objectContaining({ statusCode: 404, message: 'Product not found' }));
        });
    });

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            // First getProduct call
            productRepositoryMock.findById.mockResolvedValue(mockProduct);
            // Then update call
            const updatedMock = { ...mockProduct, name: 'Updated' };
            productRepositoryMock.update.mockResolvedValue(updatedMock);

            const result = await productService.updateProduct(1, { name: 'Updated' });

            expect(result).toEqual(updatedMock);
            expect(productRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(productRepositoryMock.update).toHaveBeenCalledWith(1, { name: 'Updated' });
        });

        it('should throw 404 if product to update not found', async () => {
            productRepositoryMock.findById.mockResolvedValue(null);

            await expect(productService.updateProduct(1, { name: 'Updated' }))
                .rejects
                .toEqual(expect.objectContaining({ statusCode: 404 }));

            expect(productRepositoryMock.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            productRepositoryMock.findById.mockResolvedValue(mockProduct);
            productRepositoryMock.delete.mockResolvedValue(mockProduct);

            const result = await productService.deleteProduct(1);

            expect(result).toEqual(mockProduct);
            expect(productRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(productRepositoryMock.delete).toHaveBeenCalledWith(1);
        });

        it('should throw 404 if product to delete not found', async () => {
            productRepositoryMock.findById.mockResolvedValue(null);

            await expect(productService.deleteProduct(1))
                .rejects
                .toEqual(expect.objectContaining({ statusCode: 404 }));

            expect(productRepositoryMock.delete).not.toHaveBeenCalled();
        });
    });
});
