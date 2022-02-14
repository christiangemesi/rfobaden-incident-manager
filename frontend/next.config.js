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
module.exports = config
