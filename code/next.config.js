/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  serverRuntimeConfig: {
    templatesDir: `${__dirname}/src/private/emails/templates`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
