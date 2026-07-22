import { Category, PaginatedResponse, Product, ProductFilters } from "@/types/product";
import { prisma } from "@/lib/prisma";

function formatProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description ?? null,
    brand: p.brand?.name ?? null,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl ?? (p.images?.[0]?.url || null),
    isActive: p.isActive,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    priceUnit: p.priceUnit ?? "PER_PIECE",
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    color: p.color ?? null,
    material: p.material ?? null,
    finish: p.finish ?? null,
    size: p.size ?? null,
    coveragePerBox: p.coveragePerBox ? Number(p.coveragePerBox) : null,
    highlights: p.highlights ?? [],
    images: p.images ? p.images.map((img: any) => img.url) : [],
  };
}

/**
 * Fetch a paginated list of products based on filters.
 */
export async function getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.category) {
      where.category = { slug: filters.category };
    }

    if (filters?.brand) {
      where.brand = { slug: filters.brand };
    }

    if (filters?.inStock) {
      where.stock = { gt: 0 };
    }

    if (filters?.material) {
      where.material = { equals: filters.material, mode: "insensitive" };
    }

    if (filters?.finish) {
      where.finish = { equals: filters.finish, mode: "insensitive" };
    }

    if (filters?.color) {
      where.color = { equals: filters.color, mode: "insensitive" };
    }

    if (filters?.size) {
      where.size = { equals: filters.size, mode: "insensitive" };
    }

    let orderBy: any = { createdAt: "desc" };
    if (filters?.sort === "price_asc") orderBy = { price: "asc" };
    if (filters?.sort === "price_desc") orderBy = { price: "desc" };
    if (filters?.sort === "oldest") orderBy = { createdAt: "asc" };

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          brand: true,
          images: { orderBy: { displayOrder: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const data = rawProducts.map(formatProduct);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error) {
    console.error("Failed to fetch products directly from DB:", error);
    return {
      data: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
    };
  }
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<{ data: Product } | null> {
  try {
    const raw = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (!raw || !raw.isActive) return null;

    return { data: formatProduct(raw) };
  } catch (error) {
    console.error("Failed to fetch product by slug from DB:", error);
    return null;
  }
}

/**
 * Fetch featured products for the homepage showcase.
 */
export async function getFeaturedProducts(): Promise<{ data: Product[] }> {
  try {
    const rawProducts = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });

    return { data: rawProducts.map(formatProduct) };
  } catch (error) {
    console.error("Failed to fetch featured products from DB:", error);
    return { data: [] };
  }
}

/**
 * Fetch all categories with product counts.
 */
export async function getCategories(): Promise<{ data: Category[] }> {
  try {
    const rawCategories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const data: Category[] = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    }));

    return { data };
  } catch (error) {
    console.error("Failed to fetch categories from DB:", error);
    return { data: [] };
  }
}

/**
 * Fetch active offers for the home page banner carousel.
 */
export async function getOffers(): Promise<{ data: any[] }> {
  try {
    const rawOffers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    return { data: rawOffers };
  } catch (error) {
    console.error("Failed to fetch offers from DB:", error);
    return { data: [] };
  }
}
