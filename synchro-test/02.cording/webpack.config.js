const webpack = require("webpack");
const DEBUG = !process.argv.includes("build");

module.exports = {
  mode: DEBUG ? "development" : "production",
  entry: {
    app_ts: "./src/_assets/ts/index.ts",
    app: "./src/_assets/js/index.js",
  },
  output: {
    // filename: "app.js",
    chunkFilename: "[name].js",
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
        },
      },
    },
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      append: DEBUG ? "\n//# sourceMappingURL=[url]" : false,
      filename: "../sourcemaps/[file].map",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
