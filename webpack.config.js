var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtoo: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.json$/,
        loaders: ['json'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader:'style!css!'
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg|webp)$/,
        loader: "url?limit=100000&context=public&name=/[path][name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff&name=./fonts/[hash].[ext]"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff&name=./fonts/[hash].[ext]"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream&name=./fonts/[hash].[ext]"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file&name=./fonts/[hash].[ext]"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml&name=./fonts/[hash].[ext]"
      },
    ]
  }
}
