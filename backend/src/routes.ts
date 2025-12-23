import { Router } from 'express';
import { ProductController } from './controllers/ProductController';
import { AuthController } from './controllers/AuthController';
import { authMiddleware } from './middlewares/authMiddleware';

const routes = Router();
const productController = new ProductController();
const authController = new AuthController();

// Auth Routes
routes.post('/auth/register', authController.register);
routes.post('/auth/login', authController.login);

// Product Routes (Public)
routes.get('/products', productController.getAll);
routes.get('/products/:id', productController.getById);

// Product Routes (Protected)
routes.post('/products', authMiddleware, productController.create);
routes.put('/products/:id', authMiddleware, productController.update);
routes.delete('/products/:id', authMiddleware, productController.delete);

export { routes };
