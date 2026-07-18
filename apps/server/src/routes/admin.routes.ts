import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// Admin product routes
router.get('/products', ProductController.getAdminProducts);

// Placeholders for future admin endpoints
// router.post('/products', ...);
// router.put('/products/:id', ...);
// router.delete('/products/:id', ...);

export default router;
