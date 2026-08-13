/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Vercel Blob public storage
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Allow common placeholder / avatar hosts used in seed data
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    // Prisma + Neon serverless driver need these treated as externals in RSC.
    serverComponentsExternalPackages: ["@prisma/client", "@prisma/adapter-neon", "@neondatabase/serverless"],
  },
  // The storefront moved from /marketplace to /nbnmarket. Permanently redirect the
  // old paths so existing links, bookmarks and search-engine results keep working.
  async redirects() {
    return [
      { source: "/marketplace", destination: "/nbnmarket", permanent: true },
      { source: "/marketplace/:path*", destination: "/nbnmarket/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
