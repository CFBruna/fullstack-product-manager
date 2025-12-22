export interface Product {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    category: string;
    stock: number;
    createdAt?: string;
    updatedAt?: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
