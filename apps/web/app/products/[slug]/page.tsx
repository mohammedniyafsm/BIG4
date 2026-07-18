import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "@/components/features/products/StockBadge";
import { RelatedProducts } from "@/components/features/products/RelatedProducts";
import { ProductGallery } from "@/components/features/products/ProductGallery";
import { ProductSpecsAccordion } from "@/components/features/products/ProductSpecsAccordion";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const response = await getProductBySlug(resolvedParams.slug);
  if (!response) return { title: "Product Not Found" };

  const product = response.data;
  return {
    title: `${product.name} | Big4 Tiles & Sanitary`,
    description: product.description || `Buy ${product.name} at Big4 Tiles & Sanitary.`,
    openGraph: {
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const response = await getProductBySlug(resolvedParams.slug);
  
  if (!response) {
    notFound();
  }

  const product = response.data;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="light-theme bg-background text-foreground min-h-screen">
      <Navbar theme="light" />
      <main className="pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <FadeIn>
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/products?category=${product.category.slug}`}>
                    {product.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Image */}
            <FadeIn delay={0.1}>
              <ProductGallery 
                images={product.imageUrl ? [product.imageUrl] : []} 
                alt={product.name} 
              />
            </FadeIn>

            {/* Right: Info */}
            <FadeIn delay={0.2} className="flex flex-col">
              <div className="mb-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {product.category.name} {product.brand && `• ${product.brand}`}
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading font-semibold leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <StockBadge stock={product.stock} />
                </div>
                
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>

              <div className="prose max-w-none mb-10 text-muted-foreground">
                {product.description ? (
                  <p className="whitespace-pre-wrap">{product.description}</p>
                ) : (
                  <p className="italic">No description available for this product.</p>
                )}
              </div>

              <div className="hidden lg:flex mt-auto pt-8 border-t border-border gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl" asChild>
                  <a href="/contact">Enquire Now</a>
                </Button>
                <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-xl" asChild>
                  <a href="/products">Back to Products</a>
                </Button>
              </div>

              {/* Product Info Table */}
              <ProductSpecsAccordion 
                specs={[
                  { label: "Category", value: product.category.name },
                  ...(product.brand ? [{ label: "Brand", value: product.brand }] : []),
                  { label: "SKU", value: product.sku },
                ]}
              />
            </FadeIn>
          </div>

          <RelatedProducts categorySlug={product.category.slug} currentProductId={product.id} />
        </div>
        
        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur border-t border-border flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</span>
            <span className="text-2xl font-bold text-foreground leading-none">{formatPrice(product.price)}</span>
          </div>
          <Button size="lg" className="flex-1 h-14 text-lg rounded-xl" asChild>
            <a href="/contact">Enquire Now</a>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
