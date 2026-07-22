import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "@/components/features/products/StockBadge";
import { RelatedProducts } from "@/components/features/products/RelatedProducts";
import { ProductGallery } from "@/components/features/products/ProductGallery";
import { ProductSpecsAccordion } from "@/components/features/products/ProductSpecsAccordion";
import { ProductActions } from "@/components/features/products/ProductActions";
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

  const effectivePrice = product.salePrice ?? product.price;

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
      price: effectivePrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.material && { material: product.material }),
    ...(product.color && { color: product.color }),
    ...(product.size && { size: product.size }),
  };

  return (
    <div className="light-theme bg-background text-foreground min-h-screen">
      <Navbar theme="light" />
      <main className="pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Image */}
            <div className="lg:sticky lg:top-32 self-start">
              <FadeIn delay={0.1}>
                <ProductGallery 
                  images={[...(product.imageUrl ? [product.imageUrl] : []), ...(product.images || [])]
                    .filter((url, index, self) => 
                      index === self.findIndex((u) => u.split('?')[0] === url.split('?')[0])
                    ).slice(0, 5)}
                  alt={product.name} 
                />
              </FadeIn>
            </div>

            {/* Right: Info */}
            <FadeIn delay={0.2} className="flex flex-col space-y-5">
              <div className="space-y-2">
                <p className="text-micro text-muted-foreground">
                  {product.category.name} {product.brand && `• ${product.brand}`}
                </p>
                <h1 className="text-page-title">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px] md:text-[26px] font-bold text-foreground leading-[1.2]">
                      {formatPrice(effectivePrice)}
                      <span className="text-[14px] font-medium text-muted-foreground ml-2">
                        {product.priceUnit === "PER_SQM" ? "/ m²" : product.priceUnit === "PER_PIECE" ? "/ pc" : product.priceUnit === "PER_BOX" ? "/ box" : "/ set"}
                      </span>
                    </span>
                    {product.salePrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <StockBadge stock={product.stock} />
                </div>
                
                <p className="text-meta">SKU: {product.sku}</p>
              </div>

              {/* Key Attributes Block */}
              {(product.color || product.material || product.finish || product.size) && (
                <div className="border border-border rounded-[var(--radius-lg)] overflow-hidden">
                  {product.color && (
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0 bg-muted/10">
                      <span className="text-muted-foreground text-sm">Colour</span>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: product.color.toLowerCase().replace(' ', '') }}></span>
                        <span className="font-medium text-sm">{product.color}</span>
                      </div>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0 bg-muted/10">
                      <span className="text-muted-foreground text-sm">Material</span>
                      <span className="font-medium text-sm">{product.material}</span>
                    </div>
                  )}
                  {product.finish && (
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0 bg-muted/10">
                      <span className="text-muted-foreground text-sm">Finish</span>
                      <span className="font-medium text-sm">{product.finish}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0 bg-muted/10">
                      <span className="text-muted-foreground text-sm">Size</span>
                      <span className="font-medium text-sm">{product.size}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-body max-w-[75ch] text-muted-foreground">
                {product.description ? (
                  <p className="whitespace-pre-wrap">{product.description}</p>
                ) : (
                  <p className="italic">No description available for this product.</p>
                )}
              </div>

              {product.highlights && product.highlights.length > 0 && (
                <div>
                  <h3 className="text-section-title mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="py-6">
                <ProductActions 
                  product={{
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    price: product.price,
                    salePrice: product.salePrice,
                    priceUnit: product.priceUnit,
                    coveragePerBox: product.coveragePerBox,
                  }} 
                />
              </div>

              <div>
                {/* Product Info Table */}
                <ProductSpecsAccordion 
                  specs={[
                    { label: "Category", value: product.category.name },
                    ...(product.brand ? [{ label: "Brand", value: product.brand }] : []),
                    { label: "SKU", value: product.sku },
                    ...(product.color ? [{ label: "Color", value: product.color }] : []),
                    ...(product.material ? [{ label: "Material", value: product.material }] : []),
                    ...(product.finish ? [{ label: "Finish", value: product.finish }] : []),
                    ...(product.size ? [{ label: "Size", value: product.size }] : []),
                    ...(product.coveragePerBox ? [{ label: "Coverage per Box", value: `${product.coveragePerBox} m²` }] : []),
                  ]}
                />
              </div>
            </FadeIn>
          </div>

          <RelatedProducts categorySlug={product.category.slug} currentProductId={product.id} material={product.material} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
