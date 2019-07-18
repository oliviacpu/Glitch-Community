const path = require('path');
require('@babel/register')({
  only: [/src/],
  presets: [['@babel/preset-env', { corejs: 3, useBuiltIns: 'usage' }], '@babel/preset-react'],
});
require('module-alias').addAlias('Utils', (fromPath, request) => {
  if (request === 'Utils/constants' || request === 'Utils/sentry') {
    return path.resolve(__dirname, '../src/utils/node');
  }
  return path.resolve(__dirname, '../src/utils');
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { StaticRouter } = require('react-router');
const { GlobalsProvider } = require('State/globals');

const { default: Link } = require('Components/link');

const { getZine } = require('./api');
const { getHomeData } = require('./home');

const render = async (origin, url) => {
  const [ZINE_POSTS, HOME_CONTENT] = await Promise.all([getZine(), getHomeData()]);
  return ReactDOMServer.renderToString(
    React.createElement(StaticRouter, { location: url },
      React.createElement(GlobalsProvider, { origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES: [] },
        React.createElement(Link, { to: '/@Greg"' }, 'asdf'),
      ),
    )
  );
};

module.exports = render;
