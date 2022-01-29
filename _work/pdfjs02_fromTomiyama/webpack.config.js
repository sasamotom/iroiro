const webpack = require("webpack");
const DEBUG = !process.argv.includes("build");

module.exports = {
  mode: DEBUG ? 'development' : 'production',
  entry: "./src/_assets/js/index.js",
  output: {
    path: __dirname,
    filename: "./app.js",
  },
  devtool: DEBUG ?  "cheap-module-source-map" : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  target: [
    "web",
    "es5",
  ],
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    })
  ]
};
