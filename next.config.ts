import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARNING !!
    // This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // other config options here
};

export default nextConfig;
