const webpack = require('webpack');
const DEBUG = !process.argv.includes('build');

module.exports = {
  mode: DEBUG ? 'development' : 'production',
  entry: './src/_assets/js/index.js',
  output: {
    filename: 'app.js',
    chunkFilename: 'vendor.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial'
        }
      }
    }
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      append: DEBUG ? '\n//# sourceMappingURL=[url]' : false,
      filename: '../sourcemaps/[file].map'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
