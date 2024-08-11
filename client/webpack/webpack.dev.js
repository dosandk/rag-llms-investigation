const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval",
  devServer: {
    port: 9001,
    hot: true,
    compress: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    devMiddleware: {
      index: true,
      publicPath: "/",
      writeToDisk: false,
    },
    client: {
      logging: "log",
    },
  },
});
