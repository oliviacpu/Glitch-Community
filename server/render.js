const path = require('path');
const src = path.join(__dirname, '../src/');

// apply transformations to the client code so it can run in node
const stylus = require('stylus');
require('@babel/register')({
  only: [(location) => location.startsWith(src)],
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

// clear client code from the require cache whenever it gets changed
// it'll get loaded off the disk again when the render calls require
const chokidar = require('chokidar');
chokidar.watch(src).on('change', () => {
  Object.keys(require.cache).forEach((location) => {
    if (location.startsWith(src)) delete require.cache[location];
  });
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');

const render = async ({ url, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => {
  const { StaticRouter } = require('react-router-dom');
  const { GlobalsProvider } = require('../src/state/globals');
  const { default: App } = require('../src/app');

  const app = React.createElement(App);
  const globalsProvider = React.createElement(GlobalsProvider, { origin: url.origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES }, app);
  const staticRouter = React.createElement(StaticRouter, { location: url.pathname + url.search + url.hash }, globalsProvider);

  const html = ReactDOMServer.renderToString(staticRouter);
  const helmet = Helmet.renderStatic();
  return { html, helmet };
};

module.exports = render;
