// Custom Next.js image loader — replaces Vercel's built-in /_next/image
// optimizer, which meters "source images" per month and returns 402 once
// that quota is used up (new uploads would break sitewide while old,
// already-cached ones kept working). Cloudinary already hosts and can
// resize/optimize product and blog images on its own CDN, so those are
// routed through Cloudinary's URL-based transformations instead. Anything
// else (local /public assets, other remote hosts) is served unoptimized.
type LoaderParams = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderParams): string {
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const q = quality ? `q_${quality}` : "q_auto";
    const transform = `f_auto,${q},w_${width},c_limit`;
    return src.replace("/upload/", `/upload/${transform}/`);
  }
  return src;
}
