export interface LuxuryItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  merchantName: string;
  network: "CJ" | "Rakuten" | "Impact" | "Direct";
  inStock: boolean;
  score?: number;
  metrics?: {
    ctr?: number;
    conversionRate?: number;
    epc?: number;
  };
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  phase: number;
  agent: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
}

export interface SystemMetrics {
  uptime: string;
  activeCollectors: number;
  itemsProcessed: number;
  cacheHitRate: number;
  queueSize: number;
  estRevenue: number;
  roi: number;
}