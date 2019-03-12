const path = require('path')
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // エントリポイントのファイル
  entry: './src/main.js',
  output: {
    // 出力先のディレクトリ
    path: path.resolve(__dirname, './dist'),
    // 出力ファイル名
    filename: 'bundle.js'
  },
  devServer: {
    // webpackの扱わないファイル(HTMLや画像など)が入っているディレクトリ
    contentBase: path.resolve(__dirname, 'public')
  },
  plugins: [new VueLoaderPlugin()],
  devtool: 'inline-source-map',
  module: {
    rules:[
        { 
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
        "node_modules"
    ],
    alias: {
        // vue.js のビルドを指定する
        vue$: 'vue/dist/vue.common.js'
    }
  },
}