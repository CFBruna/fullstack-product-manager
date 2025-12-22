import { Router } from 'express';
import { ProductController } from './controllers/ProductController';

const routes = Router();
const productController = new ProductController();

routes.post('/products', productController.create);
routes.get('/products', productController.getAll);
routes.get('/products/:id', productController.getById);
routes.put('/products/:id', productController.update);
routes.delete('/products/:id', productController.delete);

export { routes };
