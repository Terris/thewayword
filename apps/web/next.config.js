/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bittybrella.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
