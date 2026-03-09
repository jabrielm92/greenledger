/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'pdfjs-dist', 'pdf-parse', 'mammoth'],
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
