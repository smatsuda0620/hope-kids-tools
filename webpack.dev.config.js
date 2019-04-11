const path = require('path');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack/webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 8080
  },
  devtool: 'inline-source-map',
  plugins: [
    new BundleAnalyzerPlugin()
  ]
});

module.exports = config;
