const makeConfig = require('./makeConfig');

const port = !Number.isNaN(Number(process.env.PORT)) ? parseInt(process.env.PORT, 10) : 3022;

const config = makeConfig(port, __dirname, 'welogix');
config.set('vendor_base', [
  'babel-polyfill', // TODO https://github.com/ant-design/ant-design/issues/3400
  'react',
  'react-dom',
  'react-intl',
  'react-redux',
  'react-router',
  'redux',
  'antd',
  'rc-queue-anim',
  'rc-tween-one',
  'socket.io-client',
  'superagent',
  'moment',
  'xlsx',
  'file-saver',
  'detect-browser',
  'bizcharts',
  'braft-editor',
  'react-codemirror2',
  'codemirror',
  'currency-formatter',
  'jsbarcode',
  'browser-audio',
]);

config.set('vendor_large', [
  '@handsontable/react',
  'handsontable',
  'ant-design-pro',
  'immutability-helper',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-resizable',
]);

module.exports = config;
