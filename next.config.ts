import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'export' for Capacitor/Android builds; 'standalone' for server deployment
  // For APK build: set output to "export" and run: npx next build --webpack
  // For dev server: output can be "standalone" or "export" - Turbopack handles both
  output: "standalone",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
