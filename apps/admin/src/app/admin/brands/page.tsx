import type { Metadata } from "next";
import { brandService } from "@/services/brand.service";
import { BrandListClient } from "@/components/brands/BrandListClient";

export const metadata: Metadata = {
    title: "Brands — Big4 Admin",
    description: "Manage product brands",
};

/**
 * /admin/brands — Brand management page.
 */
export default async function BrandsPage() {
    const brands = await brandService.getAll();

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#111827" }}>
                    Brands
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
                    Manage your product brands
                </p>
            </div>

            <BrandListClient brands={brands} />
        </div>
    );
}
