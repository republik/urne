const buildId = process.env.VERCEL_GIT_COMMIT_SHA || process.env.SOURCE_VERSION

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
