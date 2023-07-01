/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
