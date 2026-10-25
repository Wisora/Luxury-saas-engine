import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow external image hosts for <Image /> component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash Fallbacks
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Direct image URLs fallback
      },
    ],
  },

  // Allowed cross-origin headers for Server Actions
  experimental: {
    serverActions: {
      allowedOrigins: [
        'luxuryengine.wisorainnovations.com',
        '*.wisorainnovations.com',
        'wisorainnovations.com',
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