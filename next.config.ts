import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows remote images from affiliate networks and external sources
      },
    ],
  },
};

export default nextConfig;