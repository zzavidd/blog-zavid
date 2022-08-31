const fs = require('fs');

const dkmPrivateKey = fs.readFileSync(`${__dirname}/dkim-private.key`, {
  encoding: 'utf8',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  serverRuntimeConfig: {
    dkmPrivateKey,
    templatesDir: `${__dirname}/src/private/emails/templates`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
