import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bitsapi.dsrt321.online",
        port: "",
        pathname: "/**", // Allows all paths from this hostname
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
