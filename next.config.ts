import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },
  // Configure headers for COEP/CORP support
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.platform.openai.com https://*.openai.com https://sentinel.openai.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.openai.com https://sentinel.openai.com; frame-ancestors 'self' https://*.openai.com https://*.platform.openai.com; frame-src 'self' https://*.openai.com https://*.platform.openai.com https://sentinel.openai.com; worker-src 'self' https://sentinel.openai.com;",
          },
          // Remove X-Frame-Options to allow iframe embedding (CSP frame-src handles this)
          // {
          //   key: 'X-Frame-Options',
          //   value: 'SAMEORIGIN',
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
