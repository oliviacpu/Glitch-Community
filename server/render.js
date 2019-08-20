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

const render = async ({ url, cache, signedIn, AB_TESTS, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => {
  const { Page, resetState } = require('../src/server');
  resetState();

  // don't use <ReactSyntax /> so babel can stay scoped to the src directory
  const page = React.createElement(Page, {
    origin: url.origin,
    route: url.pathname + url.search + url.hash,
    cache,
    signedIn,
    AB_TESTS,
    ZINE_POSTS,
    HOME_CONTENT,
    EXTERNAL_ROUTES,
  });

  const html = ReactDOMServer.renderToString(page);
  const helmet = Helmet.renderStatic();
  return { html, helmet };
};

module.exports = render;
