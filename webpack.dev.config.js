const path = require('path');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack/webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'production',
  devServer: {
    contentBase: path.resolve(__dirname, 'public')
  },
  devtool: 'inline-source-map',
  plugins: [
    new BundleAnalyzerPlugin({
      generateStatsFile: true
    })
  ]
});

module.exports = config;
