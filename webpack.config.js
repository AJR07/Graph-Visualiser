/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV == "production" ? "source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV ?? "production"
      ),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "index.html", to: "index.html" }],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".html"],
    alias: {
      vue: process.env.NODE_ENV == "development" ? "vue/dist/vue.esm.browser.js" : "vue/dist/vue.esm.browser.min.js",
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  performance: {
    hints: false,
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    })],
  }
};
