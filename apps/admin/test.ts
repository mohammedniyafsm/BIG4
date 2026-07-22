import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function run() {
    const { prisma } = await import("./src/lib/prisma");
    const category = await prisma.category.findFirst();
    const brand = await prisma.brand.findFirst();
    
    if (!category || !brand) {
        console.error("No category or brand found");
        return;
    }

    const { productService } = await import("./src/services/product.service");
    try {
        const result = await productService.create({
            name: "Test Product With Decimal",
            sku: "TEST-DECIMAL-001",
            price: 100,
            costPrice: 80,
            stock: 10,
            categoryId: category.id,
            brandId: brand.id,
            priceUnit: "PER_SQM",
            salePrice: 90.5,
            coveragePerBox: 1.44,
            images: [],
            highlights: ["test highlight"],
            featured: false,
        });
        console.log("Success:", result);
    } catch (e) {
        console.error("Prisma error:", e);
    }
}

run();
