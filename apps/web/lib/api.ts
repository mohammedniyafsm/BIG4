import { Category, PaginatedResponse, Product, ProductFilters } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

/**
 * Helper to fetch data from the API.
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const res = await fetch(url, {
    // Default revalidation of 60 seconds for performance, can be overridden
    next: { revalidate: 60 },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch a paginated list of products based on filters.
 */
export async function getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : "/products";
  
  return fetchApi<PaginatedResponse<Product>>(endpoint);
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<{ data: Product } | null> {
  try {
    return await fetchApi<{ data: Product }>(`/products/${slug}`);
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

/**
 * Fetch all categories with product counts.
 */
export async function getCategories(): Promise<{ data: Category[] }> {
  try {
    return await fetchApi<{ data: Category[] }>("/categories");
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { data: [] };
  }
}
