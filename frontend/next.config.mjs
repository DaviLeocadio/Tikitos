/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:8080/auth/:path*",
      },
      {
        source: "/vendedor/:path*",
        destination: "http://localhost:8080/vendedor/:path*",
      },
    ];
  },
};

export default nextConfig;
