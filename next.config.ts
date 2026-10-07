import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase storage for thumbnails
        protocol: "https",
        hostname: "mwsbtbsjzpwiwshvlqam.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase storage (signed URLs)
        protocol: "https",
        hostname: "mwsbtbsjzpwiwshvlqam.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        // Google user profile avatars (from Google OAuth)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Google CDN avatars
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
