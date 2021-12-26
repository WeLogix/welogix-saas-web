const webpack = require('webpack');
const WebpackIsomorphicPlugin = require('webpack-isomorphic-tools/plugin');
const wpConfig = require('./wpbase');
const config = require('../config');
const isomorphicPlugin = new WebpackIsomorphicPlugin(require('./isomorphic'));

wpConfig.entry.app = [
  // 'webpack/hot/dev-server',
  config.get('client_entry'),
];

// Configuration for dev server
wpConfig.devServer = {
  contentBase: config.get('webpack_dev_path'),
  hot: true,
  // quiet: true,
  inline: true,
  progress: true,
  stats: {
    colors: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  host: '0.0.0.0',
  port: config.get('webpack_port'),
};
wpConfig.devtool = 'cheap-module-eval-source-map';

wpConfig.output.filename = '[name].js';
wpConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
// sync with browser while developing
wpConfig.module.rules.push({
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
    'less-loader',
  ],
  // loader: 'style!css?&sourceMap!postcss!less',
});

wpConfig.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
  ],
});

wpConfig.plugins.push(isomorphicPlugin.development());

// any image below or equal to 10K will be converted to inline base64 instead
wpConfig.module.rules.push({ test: isomorphicPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });

module.exports = wpConfig;
