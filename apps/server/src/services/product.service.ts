import { ProductRepository } from '../repositories/product.repository';
import { Prisma } from '@prisma/client';

export class ProductService {
  private repository = new ProductRepository();

  /**
   * Maps a raw Prisma product to the public DTO expected by the frontend.
   * Strips sensitive fields like `costPrice`.
   */
  private mapToPublicDTO(product: any) {
    const { costPrice, categoryId, brandId, ...safeData } = product;
    return {
      ...safeData,
      brand: product.brand?.name || null,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      } : null,
      images: product.images ? product.images.map((img: any) => img.url) : [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async getPublicProducts(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.brand) {
      where.brand = { name: filters.brand };
    }
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (filters.material) where.material = filters.material;
    if (filters.finish) where.finish = filters.finish;
    if (filters.color) where.color = filters.color;
    if (filters.size) where.size = filters.size;

    // Price range using JS logic for where clause since Prisma doesn't natively support COALESCE in where.
    // However, if we just use OR for salePrice vs price, it's doable:
    if (filters.minPrice || filters.maxPrice) {
      const min = Number(filters.minPrice) || 0;
      const max = Number(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
      where.OR = [
        { salePrice: { gte: min, lte: max } },
        { salePrice: null, price: { gte: min, lte: max } },
      ];
    }

    let products: any[] = [];
    let total = 0;

    if (filters.sort === 'price_asc' || filters.sort === 'price_desc') {
      const direction = filters.sort === 'price_asc' ? 'asc' : 'desc';
      const [sortedIds, rawTotal] = await Promise.all([
        this.repository.findSortedIdsByPrice({ skip, take: limit, filters, direction }),
        this.repository.countRaw(filters),
      ]);
      
      if (sortedIds.length > 0) {
        const unorderedProducts = await this.repository.findAll({
          where: { id: { in: sortedIds } },
        });
        // Restore sort order
        products = sortedIds.map(id => unorderedProducts.find(p => p.id === id)).filter(Boolean);
      } else {
        products = [];
      }
      total = rawTotal;
    } else {
      let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
      if (filters.sort === 'name_asc') orderBy = { name: 'asc' };
      else if (filters.sort === 'name_desc') orderBy = { name: 'desc' };
      
      const [fetchedProducts, standardTotal] = await Promise.all([
        this.repository.findAll({ skip, take: limit, where, orderBy }),
        this.repository.count(where),
      ]);
      products = fetchedProducts;
      total = standardTotal;
    }

    return {
      data: products.map(this.mapToPublicDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicProductBySlug(slug: string) {
    const product = await this.repository.findBySlug(slug);
    if (!product || !product.isActive) return null;
    return { data: this.mapToPublicDTO(product) };
  }

  async getFeaturedProducts() {
    let featuredProducts = await this.repository.findAll({
      where: { isActive: true, featured: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    if (featuredProducts.length < 4) {
      const fallbackLimit = 8 - featuredProducts.length;
      const featuredIds = featuredProducts.map((p: any) => p.id);
      
      const fallbackProducts = await this.repository.findAll({
        where: { 
          isActive: true,
          id: { notIn: featuredIds }
        },
        orderBy: { createdAt: 'desc' },
        take: fallbackLimit,
      });

      featuredProducts = [...featuredProducts, ...fallbackProducts];
    }

    return {
      data: featuredProducts.map(this.mapToPublicDTO),
    };
  }

  async getAdminProducts(filters: any) {
    // Admin gets all products, including inactive and costPrice
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.repository.findAll({ skip, take: limit }),
      this.repository.count(),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
