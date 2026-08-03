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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
      // Renamed products (old slug -> current slug), ranked by real Search Console impressions
      {
        source: "/product/choco-coffee-face-wash-hydration-100ml",
        destination: "/product/choco-coffee-face-wash-100ml",
        permanent: true,
      },
      {
        source: "/product/coconut-curry-hair-oil-treyfa-30ml",
        destination: "/product/coconut-curry-hair-oil-30ml",
        permanent: true,
      },
      {
        source: "/product/herbal-henna-black-hair-oil",
        destination: "/product/herbal-henna-black-hair-oil-100ml",
        permanent: true,
      },
      {
        source: "/basil-heaven-heal-oil",
        destination: "/product/basil-healing-oil-heaven-100ml",
        permanent: true,
      },
      {
        source: "/product/curry-leaves-hair-oil-growth-100ml",
        destination: "/product/curry-leaves-hair-oil-100ml",
        permanent: true,
      },
      {
        source: "/product/neem-anti-dandruff-shampoo-and-conditioner-30ml",
        destination: "/product/neem-anti-dandruff-shampoo-conditioner-30ml",
        permanent: true,
      },
      {
        source: "/product/hibiscus-conditioner-for-dry-and-damaged-hair",
        destination: "/product/hibiscus-conditioner-dry-damaged-30ml",
        permanent: true,
      },
      // Old WooCommerce taxonomy/attribute pages with no direct equivalent
      { source: "/brand/:path*", destination: "/", permanent: true },
      { source: "/quantity/:path*", destination: "/products", permanent: true },
      { source: "/item-form/:path*", destination: "/products", permanent: true },
      // Old generic slugs that covered multiple size/variant SKUs on the new site - send to catalog rather than guess wrong
      {
        source: "/product/coconut-henna-black-hair-oil",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/product/powerful-neem-anti-dandruff-shampoo-conditioner",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      {
        source: "/product/hibiscus-shampoo-hair-growth-hair-fall-control",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      {
        source: "/product/neem-anti-dandruff-shampoo-conditioner",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      {
        source: "/product/hibiscus-argan-conditioner",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      {
        source: "/product/hibiscus-argan-deep-repair-conditioner-30ml",
        destination: "/products?category=hair-care",
        permanent: true,
      },
      { source: "/hibiscus-conditioner", destination: "/products?category=hair-care", permanent: true },
      { source: "/virgin-coconut-vetiver-oil", destination: "/products?category=hair-care", permanent: true },
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
