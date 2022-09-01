const fs = require('fs');

const dkimPath = `${__dirname}/dkim.key`;
let dkimPrivateKey = null;

if (fs.existsSync(dkimPath)) {
  dkimPrivateKey = fs.readFileSync(dkimPath, { encoding: 'utf8' });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
