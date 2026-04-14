import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Production source maps for debugging
  productionBrowserSourceMaps: false,

  // Compression
  compress: true,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "@tanstack/react-query",
      "lucide-react",
      "react-icons",
      "framer-motion",
      "sonner",
    ],
  },

  // External packages
  serverExternalPackages: ["axios"],

  // Headers for performance & security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Link",
            value:
              "</fonts/geist-sans.var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [];
  },

  // Rewrites for proxy
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // React libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
              name: "react-libs",
              priority: 10,
              reuseExistingChunk: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](framer-motion|tailwindcss|lucide-react)[\\/]/,
              name: "ui-libs",
              priority: 9,
              reuseExistingChunk: true,
            },
            // Query client
            query: {
              test: /[\\/]node_modules[\\/](@tanstack[\\/]react-query)[\\/]/,
              name: "query-libs",
              priority: 8,
              reuseExistingChunk: true,
            },
            // Common chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Security and performance
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default withNextIntl(nextConfig);
