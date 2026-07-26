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
};

export default nextConfig;
