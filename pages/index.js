export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🍳 Cravio - AI Chef</h1>
      <p>Welcome to Cravio! Your friendly AI chef is ready to help.</p>
      <p>
        <strong>API Endpoints:</strong>
      </p>
      <ul>
        <li>GET /api/health - Health check</li>
        <li>POST /api/meal-suggestion - Get meal suggestions</li>
      </ul>
      <p>
        Put your frontend files in the <code>public</code> folder to serve them statically.
      </p>
    </div>
  );
}

// next.config.js (optional configuration)
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
