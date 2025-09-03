/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you want to serve your existing HTML files
  async rewrites() {
    return [
      {
        source: '/app.html',
        destination: '/app.html',
      },
    ];
  },
};
