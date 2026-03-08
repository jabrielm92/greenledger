/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'pdfjs-dist'],
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
