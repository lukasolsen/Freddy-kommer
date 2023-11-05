const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  mode: "production",

  entry: {
    //popup: path.join(srcDir, 'popup.tsx'),
    //options: path.join(srcDir, 'options.tsx'),
    background: path.join(srcDir, "background_script.ts"),
    content_script: path.join(srcDir, "content_script.ts"),
    utils: path.join(srcDir, "utils/", "utils.ts"),
    styles: path.join(srcDir, "styles/", "styles.ts"),
    popup: path.join(srcDir, "popup/", "popup.ts"),
    index: path.join(srcDir, "popup/", "index.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
};
