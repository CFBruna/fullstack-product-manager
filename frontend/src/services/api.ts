import axios from 'axios';
import type { Product, ProductInput } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (data: ProductInput): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
};

export const updateProduct = async (id: number, data: Partial<ProductInput>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
};
