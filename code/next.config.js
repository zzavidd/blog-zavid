const fs = require('fs');

const dkimPath = `${__dirname}/dkim.key`;

let dkimPrivateKey = null;
if (fs.existsSync(dkimPath)) {
  dkimPrivateKey = fs.readFileSync(dkimPath, { encoding: 'utf8' });
}

/** @type {import('next').NextConfig} */
module.exports = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverRuntimeConfig: {
    dkimPrivateKey,
    templatesDir: `${__dirname}/src/private/emails/templates`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
