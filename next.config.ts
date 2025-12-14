import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["http://192.168.150.175:3000", "http://localhost:3000"],
};

export default nextConfig;
