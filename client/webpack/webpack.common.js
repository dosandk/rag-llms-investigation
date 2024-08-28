require("dotenv").config();

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const jsLoaders = require("./loaders/js-loaders");
const cssLoaders = require("./loaders/css-loaders");

module.exports = {
  target: "web",
  stats: {
    errorDetails: true,
  },
  entry: {
    config: path.join(__dirname, "../src/config.js"),
    analytics: path.join(__dirname, "../src/google-analytics.js"),
    app: path.join(__dirname, "../src/index.js"),
  },
  output: {
    publicPath: "/",
    filename: "[name].bundle.js",
    path: path.join(__dirname, "../dist"),
    chunkFilename: "[name]-[id].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: "raw-loader",
      },
      {
        test: /\.(css|scss)$/i,
        use: cssLoaders,
      },
      {
        test: /\.(js)?$/,
        use: jsLoaders,
        exclude: [/(node_modules)/],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.BACKEND_URL": JSON.stringify(process.env.BACKEND_URL),
      "process.env.GOOGLE_ANALYTICS": JSON.stringify(
        process.env.GOOGLE_ANALYTICS,
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/index.html"),
      favicon: path.join(__dirname, "../src/favicon.ico"),
    }),
  ],
};
