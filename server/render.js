const path = require('path');
const stylus = require('stylus');
require('@babel/register')({
  only: [/\/src\//],
  presets: [
    ['@babel/preset-env', { corejs: 3, useBuiltIns: 'usage' }],
    '@babel/preset-react',
  ],
  plugins: [
    ['css-modules-transform', {
      preprocessCss: (data, filename) => stylus.render(data, { filename }),
      extensions: ['.styl'],
    }],
  ],
});
require('module-alias').addAlias('Utils', (fromPath, request) => {
  if (request === 'Utils/constants' || request === 'Utils/sentry') {
    return path.resolve(__dirname, '../src/utils/node');
  }
  return path.resolve(__dirname, '../src/utils');
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { StaticRouter } = require('react-router-dom');
const { GlobalsProvider } = require('State/globals');

const { default: App } = require('../src/app');

const render = async ({ url, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => {
  const app = React.createElement(App);
  const globalsProvider = React.createElement(GlobalsProvider, { origin: url.origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES }, app);
  const root = React.createElement(StaticRouter, { location: url.pathname + url.search + url.hash }, globalsProvider);
  return ReactDOMServer.renderToString(root);
};

module.exports = render;
