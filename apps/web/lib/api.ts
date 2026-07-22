import { Category, PaginatedResponse, Product, ProductFilters } from "@/types/product";

// On the server, we need the full URL. On the client, we use relative URL so Next.js rewrites can proxy it.
const API_BASE_URL = typeof window === "undefined" 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"
  : "";

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
  
  return fetchApi<PaginatedResponse<Product>>(endpoint, {
    next: { tags: ["products"], revalidate: 0 }
  });
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<{ data: Product } | null> {
  try {
    return await fetchApi<{ data: Product }>(`/products/${slug}`, {
      next: { tags: ["products", `product-${slug}`], revalidate: 0 }
    });
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

/**
 * Fetch featured products for the homepage showcase.
 */
export async function getFeaturedProducts(): Promise<{ data: Product[] }> {
  try {
    return await fetchApi<{ data: Product[] }>("/products/featured", {
      next: { tags: ["products"], revalidate: 0 }
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return { data: [] };
  }
}

/**
 * Fetch all categories with product counts.
 */
export async function getCategories(): Promise<{ data: Category[] }> {
  try {
    return await fetchApi<{ data: Category[] }>("/categories", {
      next: { tags: ["categories"], revalidate: 0 }
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { data: [] };
  }
}

/**
 * Fetch active offers for the home page banner carousel.
 */
export async function getOffers(): Promise<{ data: any[] }> {
  try {
    return await fetchApi<{ data: any[] }>("/offers", {
      next: { tags: ["offers"], revalidate: 0 }
    });
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return { data: [] };
  }
}
