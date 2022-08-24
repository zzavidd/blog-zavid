/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    templatesDir: `${__dirname}/src/private/emails/templates`,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
