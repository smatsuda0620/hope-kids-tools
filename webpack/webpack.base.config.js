const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
require('dotenv').config();

module.exports = {
  entry: './src/main.js',
  optimization: {
    minimize: true,
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new HardSourceWebpackPlugin(),
    new webpack.EnvironmentPlugin([
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_DATABASE_URL',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID'
    ])
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
          }
        }
      }, {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      'node_modules'
    ],
    alias: {
      vue$: 'vue/dist/vue.common.js',
      components: path.resolve(process.cwd(), 'src/components'),
      pages: path.resolve(process.cwd(), 'src/pages'),
      config: path.resolve(process.cwd(), 'config')
    }
  },
};
