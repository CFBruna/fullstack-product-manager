import swaggerIds from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product Management API',
            version: '1.0.0',
            description: 'API documentation for the Product Management System'
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: []
    },
    apis: ['./src/routes.ts']
};

export const swaggerSpec = swaggerIds(options);
