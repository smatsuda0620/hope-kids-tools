const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack/webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
});

module.exports = config;
