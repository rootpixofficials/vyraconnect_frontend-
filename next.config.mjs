/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type checked locally via tsc to prevent Cloudways memory limits
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
