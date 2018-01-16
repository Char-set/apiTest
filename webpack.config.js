var path = require('path')
const resolve = require('path').resolve
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonJsFiles = [
  './src/common/api-request.js',
  './src/common/cookie.js',
  './src/common/utils.js'
]

module.exports = {
  entry: {
    // common:commonJsFiles,
    build:['./src/main.js'],
    // vendor: ['./src/common/vendor.js'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['common', 'vendor', 'manifest']
    // }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: resolve('dist', 'index.html'),
      // progress: opts.dev ? false : true
    }),
  ])
}
