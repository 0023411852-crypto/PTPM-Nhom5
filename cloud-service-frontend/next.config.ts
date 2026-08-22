import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
