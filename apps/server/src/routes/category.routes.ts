import { Router } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      }
    });

    const formatted = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: cat._count.products
    }));

    res.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
