import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.website.replace(/\/$/, "");

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getProducts({ limit: 1000 }).catch(() => null);
    if (productsRes && productsRes.data) {
      productRoutes = productsRes.data.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  // Dynamic category filter routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categoriesRes = await getCategories().catch(() => ({ data: [] }));
    if (categoriesRes && categoriesRes.data) {
      categoryRoutes = categoriesRes.data.map((category) => ({
        url: `${baseUrl}/products?category=${encodeURIComponent(category.slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap category fetch error:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
