/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['replicate', 'openai'],
  },
  images: {
    domains: ['replicate.com', 'pbxt.replicate.delivery', 'cdn.runwayml.com'],
  },
  // Increase timeout for API routes
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
    externalResolver: true,
  },
}

module.exports = nextConfig
