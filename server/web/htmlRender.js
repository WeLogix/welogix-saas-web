// import React from 'react';
// import ReactDom from 'react-dom/server';
// const serialize = require('serialize-javascript');
// import { match } from 'react-router';
// import { addLocaleData } from 'react-intl';
// const createStore = require('common/webReduxStore');
// import appWrapped from 'client/common/appWrapped';
// import fetchInitialState from '../util/fetch-initial-state';
const { version } = require('../../package.json');
const thirdPart = require('./thirdPart');

let trackJs = '';
let daoVoice = '';
// let routes;
if (__PROD__) {
  trackJs = thirdPart;
  // document插入可能影响 pageJs的mount响应, 需要放到body里面
  daoVoice = '<script>(function(i,s,o,g,r,a,m){i["DaoVoiceObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.charset="utf-8";m.parentNode.insertBefore(a,m)})(window,document,"script",(\'https:\' == document.location.protocol ? \'https:\' : \'http:\') + "//widget.daovoice.io/widget/dcb1ac4c.js","daovoice")</script>';
  // routes = require('../../client/apps/routes');
}

function renderAsHtml(pageCss, pageJs, content) {
  return `<!DOCTYPE html>
<!-- Copyright (c) 2016-2019 WeLogix, All Rights Reserved -->
<html>
<head>
  <title>WeLogix Cloud</title>
  <meta charset="utf-8">
  <meta name="robots" content="NOINDEX,NOFOLLOW">
  <meta name="version" content="${version}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="shortcut icon" href="${__CDN__}/assets/img/favicon.ico"/>
  <link rel="apple-touch-icon-precomposed" href="${__CDN__}/assets/img/apple-touch-icon-57x57-precomposed.png" />
  <link rel="apple-touch-icon-precomposed" href="${__CDN__}/assets/img/apple-touch-icon-72x72-precomposed.png" sizes="72x72" />
  <link rel="apple-touch-icon-precomposed" href="${__CDN__}/assets/img/apple-touch-icon-114x114-precomposed.png" sizes="114x114" />
  <link rel="apple-touch-icon-precomposed" href="${__CDN__}/assets/img/apple-touch-icon-144x144-precomposed.png" sizes="144x144" />
  ${pageCss}
</head>
<body>
  <div id="mount" class="full-container">${content}</div>
  <script src="https://a.alipayobjects.com/g/datavis/g6/0.2.2/index.js"></script>
  ${pageJs}
  ${trackJs}
  ${daoVoice}
</body>
</html>`;
}

function inlineRenderHtmls(initialState, content) {
  const assets = webpackIsomorphicTools.assets();
  let pageCss = '';
  Object.keys(assets.styles).forEach((style) => {
    pageCss += `<link href="${assets.styles[style]}" rel="stylesheet" type="text/css" />`;
  });
  // manifest could be inline script
  let pageJs = `
            <script>
            __INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>`;
  pageJs += assets.javascript.manifest ? `<script src="${assets.javascript.manifest}"></script>` : '';
  pageJs += assets.javascript.vendor ? `<script src="${assets.javascript.vendor}"></script>` : '';
  Object.keys(assets.javascript).filter(script => script !== 'vendor' && script !== 'manifest')
    .forEach((script) => {
      pageJs += `<script src="${assets.javascript[script]}"></script>`;
    });
  return renderAsHtml(pageCss, pageJs, content);
}

// https://github.com/koa-modules/locale/blob/master/index.js
/* function getRequestLocale(request) {
  const accept = request.acceptsLanguages() || '';
  const reg = /(^|,\s*)([a-z-]+)/gi;
  let m = reg.exec(accept);
  let locale;
  while (m) {
    if (!locale) {
      locale = m[2];
    }
    m = reg.exec(accept);
  }
  locale = locale && locale.split('-')[0];
  return locale || 'zh';
} */
module.exports = function render(request/* , locale */) {
  if (!__PROD__) {
    webpackIsomorphicTools.refresh();
  }
  // return new Promise((resolve, reject) => {
  // const url = request.url;
  const initialState = {
    corpDomain: {
      logo: '', // url undefined query error
      name: '', // Home required
      subdomain: request.query.subdomain,
    },
  };

  // if (!__PROD__) {
  return inlineRenderHtmls(initialState, ''); // resolve(inlineRenderHtmls(store, ''));
  /* }
    // const cookie = request.get('cookie');
    const curLocale = locale || getRequestLocale(request);
    store.getState().prefrence = { locale: curLocale };
    match({ routes: routes(store, cookie), location: url }, (err, redirection, props) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!props) {
        reject([404]);
      } else {
        if (curLocale === 'zh') {
          // no--dynamic-require
          addLocaleData(require('react-intl/locale-data/zh'));
        } else if (curLocale === 'en') {
          addLocaleData(require('react-intl/locale-data/en'));
        }
        fetchInitialState(props.components, store, cookie, props.location, props.params)
          .then(() => {
            const App = appWrapped(routes);
            const component = (<App routingContext={props} store={store} />);
            const content = ReactDom.renderToString(component);
            const htmls = inlineRenderHtmls(store, content);
            resolve(htmls);
          }).catch((e) => {
            reject(e);
          });
      }
    }); */
  // });
};
