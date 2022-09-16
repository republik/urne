const buildId = process.env.SOURCE_VERSION

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  generateBuildId: () => buildId,
  publicRuntimeConfig: {
    buildId,
    hash: buildId,
  },
}

module.exports = nextConfig
