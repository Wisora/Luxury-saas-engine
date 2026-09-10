// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['luxury-saas-engine.vercel.app', '*.wisora.com', 'localhost:3000'],
    },
  },
};
export default nextConfig;