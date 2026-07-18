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
    { name: "Tiles", slug: "tiles" },
    { name: "Sanitary Ware", slug: "sanitary-ware" },
    { name: "Fittings", slug: "fittings" },
    { name: "Pipes & Plumbing", slug: "pipes-and-plumbing" },
    { name: "Construction Chemicals", slug: "construction-chemicals" },
    { name: "Interior Products", slug: "interior-products" },
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

async function main() {
    await seedAdmin();
    await seedCategories();
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
