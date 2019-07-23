const stylus = require('stylus');
require('@babel/register')({
  only: [/\/src\//],
  presets: [
    ['@babel/preset-env', { corejs: 3, useBuiltIns: 'usage' }],
    '@babel/preset-react',
  ],
  plugins: [
    ['module-resolver', {
      alias: { '@sentry/browser': '@sentry/node' },
    }],
    ['css-modules-transform', {
      preprocessCss: (data, filename) => stylus.render(data, { filename }),
      extensions: ['.styl'],
    }],
  ],
});

const chokidar = require('chokidar');
const watcher = chokidar.watch('../src');
watcher.on('ready', () => {
  console.log('client ready');
  watcher.on('all', () => {
    console.log('client change');
  });
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');

const { StaticRouter } = require('react-router-dom');
const { GlobalsProvider } = require('../src/state/globals');

const { default: App } = require('../src/app');

const render = async ({ url, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => {
  const app = React.createElement(App);
  const globalsProvider = React.createElement(GlobalsProvider, { origin: url.origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES }, app);
  const staticRouter = React.createElement(StaticRouter, { location: url.pathname + url.search + url.hash }, globalsProvider);
  const html = ReactDOMServer.renderToString(staticRouter);
  const helmet = Helmet.renderStatic();
  return { html, helmet };
};

module.exports = render;
