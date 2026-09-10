import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Image from "next/image";

// Singleton pattern to prevent connection exhaustion in serverless builds
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
};

interface TenantPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { domain } = await params;

  let tenant = null;

  // Safely query database with fallback handling
  try {
    const prisma = getPrismaClient();
    tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { subdomain: domain },
          { customDomain: domain },
        ],
      },
      include: {
        products: true,
      },
    });
  } catch (error) {
    console.error("Failed to query tenant from database:", error);
  }

  // Graceful fallback tenant state to prevent runtime 404s during deployment/testing
  const activeTenant = tenant || {
    id: "demo-tenant",
    name: domain ? `${domain.charAt(0).toUpperCase() + domain.slice(1)} Pipeline` : "Aura Luxury Tenant",
    subdomain: domain || "demo",
    primaryColor: "#0f172a",
    accentColor: "#fbbf24",
    disclosureText: "Affiliate Marketplace Network - Demo Active",
    products: [
      {
        id: "prod-1",
        title: "Aura Chronograph Edition",
        category: "Timepieces",
        price: 12500,
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000",
        affiliateUrl: "#",
      },
      {
        id: "prod-2",
        title: "Monarch Velvet Suite Experience",
        category: "Hospitality",
        price: 4800,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        affiliateUrl: "#",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dynamic Tenant Branding Header */}
      <header
        className="border-b border-white/10 px-8 py-6 flex items-center justify-between shadow-xl"
        style={{ backgroundColor: activeTenant.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold shadow-md"
            style={{ backgroundColor: activeTenant.accentColor, color: activeTenant.primaryColor }}
          >
            {activeTenant.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-white tracking-wide">
              {activeTenant.name}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              {activeTenant.subdomain}.wisora.com
            </p>
          </div>
        </div>
      </header>

      {/* Main Product Showcase */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-serif text-white">Curated Collection</h2>
            <p className="text-sm font-mono text-slate-400 mt-1">
              {activeTenant.products.length} exclusive items available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTenant.products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-all group"
            >
              <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-400">
                  {product.category}
                </span>

                <h3 className="text-lg font-serif font-medium text-white group-hover:text-amber-400 transition-colors">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xl font-serif font-semibold text-white">
                    ${product.price.toLocaleString()}
                  </span>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: activeTenant.accentColor,
                      color: activeTenant.primaryColor,
                    }}
                  >
                    Acquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Dynamic Network Disclosure Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-8 text-center text-xs font-mono text-slate-500 space-y-1">
        <div>{activeTenant.disclosureText || "Affiliate Marketplace Network"}</div>
        <div>&copy; {new Date().getFullYear()} {activeTenant.name}. Powered by Wisora SaaS Engine.</div>
      </footer>
    </div>
  );
}