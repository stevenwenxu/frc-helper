const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  mode: "production",
  entry: {
    popup: path.join(srcDir, "popup.ts"),
    school_interviews: path.join(srcDir, "school_interviews/entry.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: ".",
        to: "../",
        context: "public",
        noErrorOnMissing: true
      }]
    }),
  ],
};
