import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{ domain: string }>;
};

export default async function TenantDashboardPage({ params }: Props) {
  const { domain } = await params;

  // 1. Fetch tenant metadata
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ subdomain: domain }, { customDomain: domain }],
    },
    select: {
      id: true,
      name: true,
      subdomain: true,
      primaryColor: true,
      accentColor: true,
    },
  });

  if (!tenant) {
    notFound();
  }

  // 2. Fetch aggregate metrics concurrently
  const [totalClicks, productsWithClicks, recentClicks] = await Promise.all([
    // Total clicks logged
    prisma.click.count({
      where: { tenantId: tenant.id },
    }),

    // Products ranked by click count
    prisma.product.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        title: true,
        category: true,
        price: true,
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: {
        clicks: {
          _count: 'desc',
        },
      },
      take: 5,
    }),

    // Recent telemetry event logs
    prisma.click.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        userAgent: true,
        referrer: true,
        createdAt: true,
        product: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const primaryColor = tenant.primaryColor || '#000000';
  const accentColor = tenant.accentColor || '#D4AF37';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Telemetry & Analytics Dashboard
            </span>
            <h1 className="text-3xl font-bold mt-1 text-white">{tenant.name}</h1>
          </div>
          <Link
            href={`/tenants/${tenant.subdomain}`}
            target="_blank"
            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
          >
            View Live Storefront ↗
          </Link>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-sm">
            <span className="text-slate-400 text-sm font-medium">Total Telemetry Clicks</span>
            <div className="text-4xl font-extrabold mt-2 text-white">{totalClicks}</div>
            <p className="text-xs text-slate-500 mt-2">All-time outbound affiliate redirects</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-sm">
            <span className="text-slate-400 text-sm font-medium">Active Catalog Products</span>
            <div className="text-4xl font-extrabold mt-2 text-white">{productsWithClicks.length}</div>
            <p className="text-xs text-slate-500 mt-2">Listed luxury items in catalog</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-sm">
            <span className="text-slate-400 text-sm font-medium">Top Product Clicks</span>
            <div className="text-4xl font-extrabold mt-2 text-amber-400">
              {productsWithClicks[0]?._count.clicks || 0}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {productsWithClicks[0]?.title || 'No products yet'}
            </p>
          </div>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products Table */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Top Performing Products</h2>
            {productsWithClicks.length === 0 ? (
              <p className="text-slate-500 text-sm">No items in store catalog yet.</p>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {productsWithClicks.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-400">
                        {item.category} • ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item._count.clicks} clicks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Event Log Table */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Click Events</h2>
            {recentClicks.length === 0 ? (
              <p className="text-slate-500 text-sm">No telemetry clicks recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {recentClicks.map((log) => (
                  <div key={log.id} className="py-3 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-300">{log.product.title}</p>
                      <p className="text-slate-500 truncate max-w-xs">
                        {log.referrer ? `Ref: ${log.referrer}` : 'Direct access'}
                      </p>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}