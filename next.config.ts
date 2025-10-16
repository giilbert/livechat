import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@usemaf/react", "@usemaf/client"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
