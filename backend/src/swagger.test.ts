import { swaggerSpec } from './swagger';

describe('Swagger Configuration', () => {
    it('should have the correct API title', () => {
        // @ts-ignore - Validating minimal structure of the generated spec
        expect(swaggerSpec.info.title).toBe('Product Management API');
    });

    it('should have the correct API version', () => {
        // @ts-ignore
        expect(swaggerSpec.info.version).toBe('1.0.0');
    });

    it('should have BearerAuth security scheme configured', () => {
        // @ts-ignore
        const securitySchemes = swaggerSpec.components?.securitySchemes;
        expect(securitySchemes).toBeDefined();
        expect(securitySchemes).toHaveProperty('bearerAuth');
        expect(securitySchemes?.bearerAuth).toEqual({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        });
    });
});
