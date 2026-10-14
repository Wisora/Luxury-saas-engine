import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow external image hosts for <Image /> component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'share.gemini.google',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },

  // Allowed cross-origin headers for Server Actions
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
