// @ts-check
const fs = require('fs');
const NextBundleAnalyzer = require('@next/bundle-analyzer');

const dkimPath = `${__dirname}/dkim.key`;

let dkimPrivateKey = null;
if (fs.existsSync(dkimPath)) {
  dkimPrivateKey = fs.readFileSync(dkimPath, { encoding: 'utf8' });
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  serverRuntimeConfig: { dkimPrivateKey },
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withBundleAnalyzer(config);
