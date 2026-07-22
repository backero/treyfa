import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Treyfa — Natural & Herbal Beauty",
    short_name: "Treyfa",
    description:
      "India's premier herbal hair and skincare brand. Natural, chemical-free shampoo, face wash, and hair oils rooted in South Indian Ayurvedic tradition.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1a0f",
    theme_color: "#0c1a0f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
