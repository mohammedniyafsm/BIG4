export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  brand: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}
