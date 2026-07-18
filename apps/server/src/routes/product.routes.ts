import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// Public routes
router.get('/', ProductController.getPublicProducts);
router.get('/:slug', ProductController.getPublicProductBySlug);

export default router;
