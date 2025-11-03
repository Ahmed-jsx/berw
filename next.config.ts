import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typedRoutes: true,
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow Cloudinary URLs
  },
};

export default nextConfig;
