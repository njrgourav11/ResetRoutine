import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['172.24.160.1', '172.24.160.1:3000', 'localhost:3000'],
};

export default nextConfig;
