const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  mode: "production",
  entry: {
    background: path.join(srcDir, "background.ts"),
    school_interviews: path.join(srcDir, "school_interviews/entry.ts"),
    popup: path.join(srcDir, "aspen/popup.ts"),
    aspen_fill: path.join(srcDir, "aspen/fill.ts"),
    options: path.join(srcDir, "options.ts"),
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
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
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
    new HtmlWebpackPlugin({
      filename: "../html/popup.html",
      template: "src/templates/popup.html",
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
