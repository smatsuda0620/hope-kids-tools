const merge = require('webpack-merge');
const baseConfig = require('./webpack/webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'production'
});

module.exports = config;
