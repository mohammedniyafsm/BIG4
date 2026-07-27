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
  priceUnit: "PER_SQM" | "PER_SQFT" | "PER_PIECE" | "PER_SET" | "PER_BOX";
  salePrice: number | null;
  color: string | null;
  material: string | null;
  finish: string | null;
  size: string | null;
  highlights: string[];
  images?: string[];
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
  material?: string;
  finish?: string;
  color?: string;
  size?: string;
}
