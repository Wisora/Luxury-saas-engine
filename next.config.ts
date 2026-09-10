import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'luxury-saas-engine.vercel.app',
        '*.vercel.app',
        '*.wisora.com',
        'wisora.com',
        'localhost:3000',
      ],
    },
  },
};

export default nextConfig;