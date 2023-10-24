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
    //background: path.join(srcDir, 'background.ts'),
    content_script: path.join(srcDir, "content_script.ts"),
    utils: path.join(srcDir, "utils/", "utils.ts"),
    styles: path.join(srcDir, "styles/", "styles.ts"),
    //add popup
    //popup: path.join(srcDir, "popup/", "index.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
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
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
    ...getHtmlPlugins(["index"]),
  ],
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        filename: `${chunk}.html`,
      })
  );
}
