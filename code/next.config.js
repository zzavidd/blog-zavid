const NextBunderAnalyzer = require('@next/bundle-analyzer');
const fs = require('fs');

const dkimPath = `${__dirname}/dkim.key`;
const withBundleAnalyzer = NextBunderAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

let dkimPrivateKey = null;
if (fs.existsSync(dkimPath)) {
  dkimPrivateKey = fs.readFileSync(dkimPath, { encoding: 'utf8' });
}

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  serverRuntimeConfig: {
    dkimPrivateKey,
    templatesDir: `${__dirname}/src/private/emails/templates`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
