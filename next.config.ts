import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
}

export default nextConfig
