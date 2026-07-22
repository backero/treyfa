import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "treyfa.in",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  async redirects() {
    return [
      // Canonicalize www -> apex (Google was indexing both, splitting ranking signals)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.treyfa.in" }],
        destination: "https://treyfa.in/:path*",
        permanent: true,
      },
      // Legacy WordPress/WooCommerce paths still indexed by Google (now hard 404s)
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/shop/:path*", destination: "/products", permanent: true },
      { source: "/shop-page", destination: "/products", permanent: true },
      { source: "/shop-2", destination: "/products", permanent: true },
      { source: "/my-account", destination: "/login", permanent: true },
      { source: "/my-account/:path*", destination: "/login", permanent: true },
      { source: "/blog-3-2", destination: "/blog", permanent: true },
      { source: "/blog-3-2/:path*", destination: "/blog", permanent: true },
      { source: "/privacy-policy-3", destination: "/privacy-policy", permanent: true },
      // Old WP category taxonomy slugs had a "-products" suffix the current slugs dropped
      {
        source: "/product-category/face-care-products",
        destination: "/products?category=face-care",
        permanent: true,
      },
      {
        source: "/product-category/hair-care-products",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      {
        source: "/product-category/bath-body-care-products",
        destination: "/products?category=bath-body-care",
        permanent: true,
      },
      {
        source: "/product-category/:slug",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/category/:path*",
        destination: "/blog",
        permanent: true,
      },
      // Renamed products (old slug -> current slug)
      {
        source: "/product/choco-coffee-face-wash-hydration-100ml",
        destination: "/product/choco-coffee-face-wash-100ml",
        permanent: true,
      },
      // Old generic slug covered two size variants on the new site - send to catalog rather than guess
      {
        source: "/product/coconut-henna-black-hair-oil",
        destination: "/products",
        permanent: true,
      },
      // Old WooCommerce numeric product URLs (/products/1299624/) - crawl-trap add-to-cart junk, never real content
      {
        source: "/products/:id(\\d+)",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
