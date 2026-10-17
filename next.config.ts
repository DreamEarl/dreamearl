import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "hlrdc4oteubqaihv.public.blob.vercel-storage.com",
        pathname: "/custom-orders/**",
      },
    ],
    qualities: [100, 75, 70],
  },
};

export default nextConfig;
