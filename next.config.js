/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'example.com'
    ],
  },
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig 