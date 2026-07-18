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
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async getPublicProducts(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

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

    const [products, total] = await Promise.all([
      this.repository.findAll({ skip, take: limit, where }),
      this.repository.count(where),
    ]);

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
