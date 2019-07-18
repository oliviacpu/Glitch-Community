const path = require('path');
const stylus = require('stylus');
require('@babel/register')({
  only: [/src/],
  presets: [
    ['@babel/preset-env', { corejs: 3, useBuiltIns: 'usage' }],
    '@babel/preset-react',
  ],
  plugins: [
    ['css-modules-transform', { preprocessCss: (data, filename) => stylus.render(data, { filename }), extensions: ['.styl'] }],
  ],
});
require('module-alias').addAlias('Utils', (fromPath, request) => {
  if (request === 'Utils/constants' || request === 'Utils/sentry') {
    console.log(fromPath);
    return path.resolve(__dirname, '../src/utils/node');
  }
  return path.resolve(__dirname, '../src/utils');
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { StaticRouter } = require('react-router');
const { GlobalsProvider } = require('State/globals');

const { default: App } = require('../src/app');

const { getZine } = require('./api');
const { getHomeData } = require('./home');

const render = async (origin, url) => {
  const [ZINE_POSTS, HOME_CONTENT] = await Promise.all([getZine(), getHomeData()]);
  return ReactDOMServer.renderToString(
    React.createElement(StaticRouter, { location: url },
      React.createElement(GlobalsProvider, { origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES: [] },
        React.createElement(App),
      ),
    )
  );
};

module.exports = render;
