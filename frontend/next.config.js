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
    return Object.assign({}, config, {
      externals: Object.assign({}, config.externals, {
        fs: 'fs',
      }),
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.md$/,
            loader: 'emit-file-loader',
            options: {
              name: 'dist/[path][name].[ext]',
            },
          },
          {
            test: /\.md$/,
            loader: 'raw-loader',
          },
        ]),
      }),
    })
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
