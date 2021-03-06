/*
- [x] Minify JS
- [ ] Tree Shaking
- [x] Separate Environments (dev and prod)
- [ ] Sourcemap
 */

const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

let config = {
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};

module.exports = config;

if (process.env.NODE_ENV === "production") {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}
