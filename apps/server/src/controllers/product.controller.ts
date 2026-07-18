import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  
  static async getPublicProducts(req: Request, res: Response) {
    try {
      const result = await productService.getPublicProducts(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching public products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPublicProductBySlug(req: Request, res: Response) {
    try {
      const result = await productService.getPublicProductBySlug(req.params.slug);
      if (!result) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result);
    } catch (error) {
      console.error('Error fetching public product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdminProducts(req: Request, res: Response) {
    try {
      const result = await productService.getAdminProducts(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
