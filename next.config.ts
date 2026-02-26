import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: "http://13.124.36.79:8000/api/v1/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
