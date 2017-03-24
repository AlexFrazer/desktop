const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const HTMLPlugin = require('webpack-html-plugin');
const electronConfig = require('./webpack.config.electron');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const srcPath = path.resolve(path.join(__dirname, 'app'));
const buildPath = path.resolve(path.join(__dirname, 'dist'));

const {
  PORT = 3000,
  NODE_ENV = "development",
} = process.env;

const isProduction = NODE_ENV === "production";

const baseConfig = {
  target: "electron-renderer",
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }]
  },
  resolve: {
    alias: {
      app: srcPath,
    },
    modules: [
      'node_modules',
      srcPath,
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
};

const devConfig = merge(baseConfig, {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${PORT}`,
      'webpack/hot/only-dev-server',
      path.join(srcPath, 'index.js'),
    ],
  },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.join(srcPath, 'index.tpl.html'),
    }),
  ],
  devServer: {
    port: PORT,
    hot: true,
    contentBase: buildPath,
    historyApiFallback: true,
    setup(app) {
      const environment = { ...process.env, PORT };
      spawn('npm', ['run', 'start-hot'], { shell: true, env: environment, stdio: 'inherit' })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    }
  },
});

const prodConfig = merge(baseConfig, {
  entry: {
    app: ['babel-polyfill', path.join(srcPath, 'index.js')],
  },
  plugins: [
    new CleanWebpackPlugin([ buildPath ]),
    new HTMLPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.join(srcPath, 'index.tpl.html'),
    }),
  ],
});

module.exports = isProduction ? [prodConfig, electronConfig] : devConfig;
