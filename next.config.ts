import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - Turbopack config not yet in types
  turbopack: {}
};

export default withPWA({
  dest: "public",
})(nextConfig);
