import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getProducts, createProduct, updateProduct, deleteProduct, login } from './api';
import type { ProductInput } from '../types';

// Use vi.hoisted to define mockApi before vi.mock uses it
const mockApi = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
        request: {
            use: vi.fn(),
            eject: vi.fn(),
        },
        response: {
            use: vi.fn(),
            eject: vi.fn(),
        }
    }
}));

// Mock axios.create to return our mockApi
vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn(() => mockApi),
        },
    };
});

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getProducts calls api.get', async () => {
        mockApi.get.mockResolvedValue({ data: [] });
        await getProducts();
        expect(mockApi.get).toHaveBeenCalledWith('/products');
    });

    it('createProduct calls api.post', async () => {
        const product: ProductInput = { name: 'Test', price: 10, category: 'Test', stock: 1, description: 'Desc' };
        mockApi.post.mockResolvedValue({ data: product });
        await createProduct(product);
        expect(mockApi.post).toHaveBeenCalledWith('/products', product);
    });

    it('updateProduct calls api.put', async () => {
        const product: ProductInput = { name: 'Test', price: 10, category: 'Test', stock: 1 };
        mockApi.put.mockResolvedValue({ data: product });
        await updateProduct(1, product);
        expect(mockApi.put).toHaveBeenCalledWith('/products/1', product);
    });

    it('deleteProduct calls api.delete', async () => {
        mockApi.delete.mockResolvedValue({});
        await deleteProduct(1);
        expect(mockApi.delete).toHaveBeenCalledWith('/products/1');
    });

    it('login calls api.post', async () => {
        const credentials = { email: 'test@test.com', password: '123' };
        mockApi.post.mockResolvedValue({ data: { token: 'abc' } });
        await login('test@test.com', '123');
        expect(mockApi.post).toHaveBeenCalledWith('/auth/login', credentials);
    });
});
