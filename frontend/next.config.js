/**
 * @type {import('next').NextConfig}
 **/
const config = {
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
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}
module.exports = config
