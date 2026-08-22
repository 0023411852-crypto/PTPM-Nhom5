import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_PROXY_URL || "http://localhost:5154"}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.API_PROXY_URL || "http://localhost:5154"}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/promotions',
        destination: '/pricing',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
