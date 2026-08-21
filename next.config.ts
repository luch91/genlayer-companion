import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The local host reports thousands of logical CPUs. Cap build workers so
    // Next does not exhaust process and memory limits while compiling.
    cpus: 2,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
