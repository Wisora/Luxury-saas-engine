'use client';
import { LuxuryItem, PipelineLog } from "../types";

export const INITIAL_LUXURY_ITEMS: LuxuryItem[] = [
  {
    id: "lux-001",
    title: "Submariner Date 126610LN",
    brand: "Rolex",
    price: 14500,
    category: "watch",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    sourceUrl: "https://www.chrono24.com/rolex/submariner-date--id12345.htm",
    affiliateNetwork: "rakuten",
    customAffiliateId: "12345",
    commissionRate: 0.06,
    status: "available",
    lastVerified: "2026-08-31T10:00:00Z"
  },
  {
    id: "lux-002",
    title: "Birkin 30 Gold Togo Leather",
    brand: "Hermès",
    price: 28900,
    category: "bag",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    sourceUrl: "https://www.farfetch.com/shopping/women/hermes-pre-owned-birkin-30-bag-item-1234.aspx",
    affiliateNetwork: "cj",
    customAffiliateId: "67890",
    commissionRate: 0.08,
    status: "available",
    lastVerified: "2026-08-31T09:45:00Z"
  },
  {
    id: "lux-003",
    title: "Royal Oak Selfwinding 15500ST",
    brand: "Audemars Piguet",
    price: 42000,
    category: "watch",
    imageUrl: "https://images.unsplash.com/photo-1547996160-01c1782698e0?auto=format&fit=crop&w=800&q=80",
    sourceUrl: "https://www.jomashop.com/audemars-piguet-watch-15500st.html",
    affiliateNetwork: "generic",
    commissionRate: 0.05,
    status: "reserved",
    lastVerified: "2026-08-31T08:12:00Z"
  },
  {
    id: "lux-004",
    title: "Limited Edition Lithograph (1974)",
    brand: "Alexander Calder",
    price: 18500,
    category: "art",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    sourceUrl: "https://www.sothebys.com/en/buy/auction/2026/prints/calder-litho",
    affiliateNetwork: "generic",
    commissionRate: 0.10,
    status: "available",
    lastVerified: "2026-08-31T07:30:00Z"
  }
];

export const INITIAL_LOGS: PipelineLog[] = [
  {
    id: "log-1",
    timestamp: "10:00:12",
    phase: 1,
    agent: "Chrono24 Collector",
    message: "Verified price delta across 4 luxury watch references.",
    status: "success"
  },
  {
    id: "log-2",
    timestamp: "09:58:04",
    phase: 2,
    agent: "Trust Guard",
    message: "Validated serial tracking hashes against counterfeit databases.",
    status: "info"
  }
];