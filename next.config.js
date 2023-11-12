// @ts-check
const NextBundleAnalyzer = require('@next/bundle-analyzer');

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['devicons-react', '@mui/lab'],
  },
  images: {
    domains:
      process.env.NEXT_PUBLIC_APP_ENV === 'production'
        ? ['res.cloudinary.com']
        : ['res.cloudinary.com', 'loremflickr.com'],
    loader: 'custom',
    loaderFile: './image-optimiser.js',
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withBundleAnalyzer(config);
