const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcPath = path.join(__dirname, 'app');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
  entry: ['babel-polyfill', path.join(srcPath, 'renderer.js')],
  target: 'electron-main',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(srcPath, 'package.json'), to: buildPath },
    ])
  ]
};
