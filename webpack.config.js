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
  }
  // devServer: {
  //   contentBase: path.resolve(__dirname, "./public/"),
  //   hot: true
  // }
};

module.exports = config;

if (process.env.NODE_ENV === "production") {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}
