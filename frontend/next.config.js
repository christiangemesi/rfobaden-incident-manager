// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 **/
const config = {
  reactStrictMode: true,

  // swcMinify: true,
  eslint: {
    dirs: [
      'components',
      'models',
      'pages',
      'services',
      'stores',
      'types',
      'utils',
    ],
  },

  images: {
    domains: process.env.NODE_ENV === 'development' ? ['backend-development'] : [],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },

  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}
module.exports = withBundleAnalyzer(config)
