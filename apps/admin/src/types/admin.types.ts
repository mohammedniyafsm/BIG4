/**
 * Admin-specific shared types.
 */

/** Standardized return type for Server Actions */
export type ActionResult<T = null> =
    | { success: true; message: string; data: T }
    | { success: false; message: string; data: null };

/** Search/filter/pagination params for product listing */
export interface ProductListParams {
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: "all" | "active" | "archived";
    sortBy?: "name" | "price" | "stock" | "createdAt";
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

/** Paginated result wrapper */
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/** Image in a product gallery */
export interface ProductImageItem {
    id: string;
    url: string;
    publicId: string;
    displayOrder: number;
}

/** Product as returned to the UI */
export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    sku: string;
    brandId: string | null;
    brandName: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    images: ProductImageItem[];
    isActive: boolean;
    categoryId: string;
    categoryName: string;
    createdAt: Date;
}

/** Dashboard summary stats */
export interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    lowStockCount: number;
    totalCategories: number;
    totalBrands: number;
    categoryCounts: { name: string; count: number }[];
}
