import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // If a custom external API URL is provided, rewrite /api requests to it.
    if (process.env.NEXT_PUBLIC_API_URL) {
      const backendTarget = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
      return [
        {
          source: "/api/:path*",
          destination: `${backendTarget}/:path*`,
        },
      ];
    }

    // In local development, proxy /api to local Express server running on port 5000
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }

    // In production on Vercel without NEXT_PUBLIC_API_URL, vercel.json routes handle /api directly
    return [];
  },
};

export default nextConfig;
