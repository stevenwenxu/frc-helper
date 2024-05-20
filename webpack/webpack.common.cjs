const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  mode: "production",
  entry: {
    background: path.join(srcDir, "background.ts"),
    school_interviews: path.join(srcDir, "school_interviews/entry.ts"),
    popup: path.join(srcDir, "popup/entry.tsx"),
    aspen_fill: path.join(srcDir, "aspen/fill.ts"),
    laserfische_fill: path.join(srcDir, "laserfische/fill.ts"),
    options: path.join(srcDir, "options/entry.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          name: "react",
          test: /[\\/]node_modules[\\/](.*react.*|@restart|scheduler|dom-helpers|classnames)[\\/]/,
          chunks: "all",
        },
        immer: {
          name: "immer",
          test: /[\\/]node_modules[\\/](.*immer.*)[\\/]/,
          chunks: "all",
        },
        bootstrap: {
          name: "bootstrap",
          test: /[\\/]node_modules[\\/](bootstrap)[\\/]/,
          type: "css/mini-extract",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          }
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
    }),
    new CopyPlugin({
      patterns: [{
        from: ".",
        to: "../",
        context: "public",
        noErrorOnMissing: true
      }]
    }),
    new HtmlWebpackPlugin({
      filename: "../html/popup.html",
      template: "src/templates/popup.html",
      version: require("../package.json").version,
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      filename: "../html/options.html",
      template: "src/templates/options.html",
      chunks: ["options"],
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
