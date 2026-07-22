import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";

/**
 * Seed script — Creates the initial Admin user and showroom categories.
 *
 * Usage: npm run db:seed
 */

// Load env files
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Create Prisma client with Neon adapter
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

/** Showroom categories to seed */
const CATEGORIES = [
    { name: "Ceramics & Tiles", slug: "ceramics-and-tiles" },
    { name: "Sanitaryware", slug: "sanitaryware" },
    { name: "Bath Fittings", slug: "bath-fittings" },
    { name: "Luxury Bath", slug: "luxury-bath" },
    { name: "Designer Surfaces", slug: "designer-surfaces" },
    { name: "Building Materials", slug: "building-materials" },
    { name: "Pipes & Fittings", slug: "pipes-and-fittings" },
];

/** Showroom brands to seed */
const BRANDS = [
    { name: "Simpolo", slug: "simpolo" },
    { name: "Italus", slug: "italus" },
    { name: "Hindware", slug: "hindware" },
    { name: "Naveen Ceramics", slug: "naveen-ceramics" },
    { name: "Marbito Ceramic", slug: "marbito-ceramic" },
    { name: "Somany", slug: "somany" },
    { name: "Anjani Tile", slug: "anjani-tile" },
    { name: "Asian Paints Bathsense", slug: "asian-paints-bathsense" },
    { name: "Johnson", slug: "johnson" },
    { name: "Vanora", slug: "vanora" },
    { name: "Jaquar", slug: "jaquar" },
    { name: "Parryware", slug: "parryware" },
    { name: "Futura", slug: "futura" },
    { name: "Brizzio", slug: "brizzio" },
    { name: "Varmora", slug: "varmora" },
    { name: "Watercare", slug: "watercare" },
    { name: "Acebond", slug: "acebond" },
    { name: "JK Tile Adhesive", slug: "jk-tile-adhesive" },
    { name: "Watertec", slug: "watertec" },
    { name: "Sintex", slug: "sintex" },
    { name: "Astral Pipes", slug: "astral-pipes" },
    { name: "Ashirvad", slug: "ashirvad" },
];

async function seedAdmin() {
    const adminEmail = "admin@big4.com";
    const adminPassword = "B!g4@Adm1n#2024Sec";
    const adminName = "Super Admin";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log(`✅ Admin user already exists: ${adminEmail}`);
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: adminName,
        },
    });

    console.log("✅ Admin user created:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.name}`);
    console.log("");
    console.log("⚠️  Change the default password in production!");
}

async function seedCategories() {
    let created = 0;
    let skipped = 0;

    for (const cat of CATEGORIES) {
        const existing = await prisma.category.findUnique({
            where: { slug: cat.slug },
        });

        if (existing) {
            skipped++;
            continue;
        }

        await prisma.category.create({ data: cat });
        created++;
    }

    if (created > 0) {
        console.log(`✅ Categories seeded: ${created} created, ${skipped} already existed`);
    } else {
        console.log(`✅ All ${CATEGORIES.length} categories already exist`);
    }
}

async function seedBrands() {
    let created = 0;
    let skipped = 0;

    for (const brand of BRANDS) {
        const existing = await prisma.brand.findUnique({
            where: { slug: brand.slug },
        });

        if (existing) {
            skipped++;
            continue;
        }

        await prisma.brand.create({ data: brand });
        created++;
    }

    if (created > 0) {
        console.log(`✅ Brands seeded: ${created} created, ${skipped} already existed`);
    } else {
        console.log(`✅ All ${BRANDS.length} brands already exist`);
    }
}

async function main() {
    await seedAdmin();
    await seedCategories();
    await seedBrands();
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
