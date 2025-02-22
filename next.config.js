/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh5.googleusercontent.com', 'lh3.googleusercontent.com', 'lh4.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig 