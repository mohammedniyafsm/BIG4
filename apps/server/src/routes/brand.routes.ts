import { Router } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

/**
 * GET /api/brands
 * Public route to fetch active brands for storefront.
 * Supports ?limit= parameter.
 */
router.get('/', async (req, res) => {
  try {
    const limitParam = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const take = limitParam && !isNaN(limitParam) && limitParam > 0 ? limitParam : undefined;

    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        displayOrder: true,
      },
    });

    res.json({ data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
