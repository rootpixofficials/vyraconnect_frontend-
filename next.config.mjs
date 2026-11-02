/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type checked locally via tsc to prevent Cloudways memory limits
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
