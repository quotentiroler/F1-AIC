/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.svg",
      },
    ];
  },
};
export default nextConfig;
