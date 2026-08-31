import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = `${process.env.DIRECT_URL || process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "watches" },
    update: {},
    create: {
      name: "Aura Fine Timepieces",
      subdomain: "watches",
      customDomain: "aurawatchco.com",
      primaryColor: "#0F172A",
      accentColor: "#D4AF37",
      disclosureText: "As an affiliate partner, we earn from qualifying purchases.",
      products: {
        create: [
          {
            title: "Patek Philippe Nautilus 5711/1A",
            category: "Watches",
            price: 115000,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            affiliateUrl: "https://example.com/affiliate/nautilus",
          },
          {
            title: "Audemars Piguet Royal Oak Jumbo",
            category: "Watches",
            price: 68000,
            imageUrl: "https://images.unsplash.com/photo-1547996160-01ff60023581",
            affiliateUrl: "https://example.com/affiliate/royaloak",
          },
        ],
      },
    },
  });

  console.log(`Successfully seeded demo tenant: ${tenant.name} (${tenant.subdomain}.wisora.com)`);
}

main()
  .catch((e) => {
    console.error("Seed script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });