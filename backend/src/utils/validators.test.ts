import { productSchema } from './validators';

describe('productSchema', () => {
    it('should validate a correct product', () => {
        const input = {
            name: 'Test Product',
            price: 100,
            category: 'Electronics',
            stock: 10,
            description: 'A test product'
        };
        const result = productSchema.parse(input);
        expect(result).toEqual({
            ...input,
            name: "Test product" // Transformed
        });
    });

    it('should sanitize strings (trim and capitalize)', () => {
        const input = {
            name: '  iphone 15  ',
            price: 999,
            category: '  smartphones  ',
            stock: 5,
            description: '  brand new  '
        };
        const result = productSchema.parse(input);
        expect(result.name).toBe('Iphone 15');
        expect(result.category).toBe('Smartphones');
        expect(result.description).toBe('Brand new');
    });

    it('should handle optional description', () => {
        const input = {
            name: 'Test',
            price: 10,
            category: 'Cat',
            stock: 1
        };
        const result = productSchema.parse(input);
        expect(result.description).toBeUndefined();
    });

    it('should fail for infinite numbers', () => {
        const input = {
            name: 'Test',
            price: Infinity,
            category: 'Cat',
            stock: 1
        };
        expect(() => productSchema.parse(input)).toThrow();
    });

    it('should fail for NaN', () => {
        const input = {
            name: 'Test',
            price: NaN,
            category: 'Cat',
            stock: 1
        };
        expect(() => productSchema.parse(input)).toThrow();
    });
});
