import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://treyfa.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/checkout",
        "/cart",
        "/orders",
        "/wishlist",
        "/login",
        "/register",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
