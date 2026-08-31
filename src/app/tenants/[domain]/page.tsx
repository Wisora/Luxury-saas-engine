import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Image from "next/image";

// Instantiate Prisma with the v7 driver adapter
const connectionString = `${process.env.DIRECT_URL || process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface TenantPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { domain } = await params;

  // Query tenant data by subdomain or custom domain
  const tenant = await prisma.tenant.findFirst({
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

  // Render 404 if no tenant exists for this host
  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dynamic Tenant Branding Header */}
      <header
        className="border-b border-white/10 px-8 py-6 flex items-center justify-between shadow-xl"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold shadow-md"
            style={{ backgroundColor: tenant.accentColor, color: tenant.primaryColor }}
          >
            {tenant.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-white tracking-wide">
              {tenant.name}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              {tenant.subdomain}.wisora.com
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
              {tenant.products.length} exclusive items available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenant.products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-all group"
            >
              <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
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
                      backgroundColor: tenant.accentColor,
                      color: tenant.primaryColor,
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
        <div>{tenant.disclosureText || "Affiliate Marketplace Network"}</div>
        <div>&copy; {new Date().getFullYear()} {tenant.name}. Powered by Wisora SaaS Engine.</div>
      </footer>
    </div>
  );
}