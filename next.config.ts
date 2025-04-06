/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: isProd, // ✅ disables ESLint in production builds
  },
};

export default nextConfig;
