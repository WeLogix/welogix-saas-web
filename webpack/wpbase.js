const path = require('path');
const webpack = require('webpack');
const config = require('../config');

const reactBabelProd = {
  plugins: [
    'transform-react-remove-prop-types',
    'transform-react-inline-elements', // https://github.com/babel/babel/issues/3728 Menu.Item
    'transform-react-constant-elements', // https://github.com/babel/babel/issues/4458 error const {} = WeUI https://github.com/babel/babel/issues/4223 goods-info const opRendered
  ],
};

const wpConfig = {
  // Entry point to the project
  entry: {
    vendor: config.get('vendor_base'),
  },
  context: path.resolve(__dirname, '..'),
  // Webpack config options on how to obtain modules
  resolve: {
    // When requiring, you don't need to add these extensions
    extensions: ['.js', '.jsx'],
    // Modules will be searched for in these directories
    // modules: [path.resolve(__dirname, '..'), nodeModulesPath],
    modules: [path.resolve(__dirname, '..'), 'node_modules'],
  },
  output: {
    path: config.get('output_path'), // Path of output file
    publicPath: config.get('webpack_public_path'),
    filename: '[name].js', // Name of output file
  },
  plugins: [
    new webpack.IgnorePlugin(/assets\.json$/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ContextReplacementPlugin(/^\.\/locale$/, (context) => {
      // check if the context was created inside the moment package
      if (!/\/moment\//.test(context.context)) { return; }
      // context needs to be modified in place
      Object.assign(context, {
        // include only japanese, korean and chinese variants
        // all tests are prefixed with './' so this must be part of the regExp
        // the default regExp includes everything; /^$/ could be used to include nothing
        regExp: /^\.\/(en|zh-cn)/,
        // point to the locale data folder relative to moment/src/lib/locale
        request: '../../locale',
      });
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __CDN__: JSON.stringify(config.get('CDN_URL')),
      XLSX_CDN: JSON.stringify(config.get('XLSX_CDN')),
      API_ROOTS: JSON.stringify(config.get('API_ROOTS')),
      __DEVTOOLS__: config.get('__DEVTOOLS__'),
      __DEV__: config.get('__DEV__'),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: { plugins: require('autoprefixer')() },
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => {
      // This prevents stylesheet resources with the .css or .scss extension
      // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.includes('node_modules');
      },
    }),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/, // All .js and .jsx files
      use: [
        'thread-loader',
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            env: {
              test: reactBabelProd,
              production: reactBabelProd,
            },
          },
        }],
      include: [path.resolve(__dirname, '..', 'client'), path.resolve(__dirname, '..', 'common')],
      exclude: ['node_modules'], // exclude node_modules so that they are not all compiled
    },
    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ],
  },
};

module.exports = wpConfig;
