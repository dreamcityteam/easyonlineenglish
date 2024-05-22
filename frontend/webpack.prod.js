const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',

  entry: path.resolve(__dirname, 'src', 'index.tsx'),

  output: {
    path: path.resolve(__dirname, '../backend/build'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(s[c|a]ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-modules-typescript-loader',
          { loader: 'css-loader', options: { modules: true } },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.sass', '.css'],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/robots.txt', to: '' },
        { from: './public/manifest.json', to: '' },
        { from: './public/logo192.png', to: '' },
        { from: './public/logo512.png', to: '' },
        { from: './public/favicon.ico', to: '' },
      ],
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html'),
      hash: true,
      favicon: './public/favicon.ico',
    }),
  ],
};
