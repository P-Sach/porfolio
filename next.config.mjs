/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Resume (5 MB) / photo (3 MB) uploads go through server actions.
    serverActions: { bodySizeLimit: '6mb' },
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
