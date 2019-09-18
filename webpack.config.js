const fs = require('fs');
const path = require('path');
const os = require('os');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoprefixerStylus = require('autoprefixer-stylus');
const StatsPlugin = require('stats-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const aliases = require('./aliases');

const BUILD = path.resolve(__dirname, 'build/client');
const SRC = path.resolve(__dirname, 'src');
const SHARED = path.resolve(__dirname, 'shared');
const NODE_MODULES = path.resolve(__dirname, 'node_modules');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

const smp = new SpeedMeasurePlugin({ outputFormat: 'humanVerbose' });

console.log(`Starting Webpack in ${mode} mode.`);

let prevBuildAssets = ['**/*'];
try {
  const prevBuildStats = JSON.parse(fs.readFileSync(path.resolve(BUILD, 'stats.json')));
  prevBuildAssets = [...prevBuildAssets, '!stats.json', ...prevBuildStats.assets.map((asset) => `!${asset.name}`)];
} catch (error) {
  // Don't worry about it, there's probably just no stats.json
}

module.exports = smp.wrap({
  mode,
  entry: {
    client: `${SRC}/client.js`,
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: BUILD,
    publicPath: '/',
  },
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'initial',
      maxInitialRequests: 6,
      cacheGroups: {
        curated: {
          name: 'curated',
          test: /[\\/]src[\\/]curated[\\/]/,
          minSize: 0,
          priority: 1,
        },
        react: {
          name: 'react',
          test: /[\\/]node_modules[\\/]react[-\\/]/,
          priority: 3,
        },
        markdown: {
          name: 'markdown',
          test: /[\\/]node_modules[\\/]markdown-it[-\\/]/,
          priority: 2,
        },
        algolia: {
          name: 'algolia',
          test: /[\\/]node_modules[\\/]algoliasearch[-\\/]/,
          priority: 2,
        },
        lodash: {
          name: 'lodash',
          test: /[\\/]node_modules[\\/]lodash[-\\/]/,
          priority: 2,
        },
        sentry: {
          name: 'sentry',
          test: /[\\/]node_modules[\\/]@sentry[-\\/]/,
          priority: 2,
        },
        modules: {
          name: 'dependencies',
          test: /[\\/]node_modules[\\/]/,
          priority: -1,
        },
      },
    },
    minimizer: [new TerserPlugin({ terserOptions: { safari10: true }, sourceMap: true })],
    noEmitOnErrors: true,
    runtimeChunk: {
      name: 'manifest',
    },
  },
  context: path.resolve(__dirname),
  resolve: {
    extensions: ['.js'],
    alias: aliases.client,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: SRC,
        loader: 'eslint-loader',
        options: {
          fix: false, //mode === 'development', // Only change source files in development
          cache: false, // Keep this off, it can use a lot of space.  Let Webpack --watch do the heavy lifting for us.
          emitError: false,
          emitWarning: true,
          failOnError: false,
          ignorePattern: 'src/curated/**',
        },
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: mode === 'development' ? [SRC, SHARED] : [SRC, SHARED, NODE_MODULES],
            query: {
              compact: mode === 'development' ? true : false,
            },
          },
          {
            test: /\.styl/,
            include: SRC,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader?modules',
                options: {
                  sourceMap: mode !== 'production', // no css source maps in production
                  modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                },
              },
              {
                loader: 'stylus-loader',
                options: {
                  compress: mode === 'production', // Compress CSS as part of the stylus build
                  use: [AutoprefixerStylus()],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin({ shorthands: true }), // adding shorthands fixes https://github.com/lodash/lodash/issues/3101
    new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' }),
    new StatsPlugin('stats.json', {
      all: false,
      assets: true,
      cachedAssets: true,
      entrypoints: true,
      hash: true,
      publicPath: true,
    }),
    new CleanWebpackPlugin({ dry: false, verbose: true, cleanOnceBeforeBuildPatterns: prevBuildAssets }),
    new EnvironmentPlugin({
      FWD_SUBDOMAIN_PREFIX: process.env.PROJECT_NAME || os.userInfo().username,
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: {
    children: false,
  },
});
