const path = require('path');
const { spawn } = require('child_process');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const createCache = require('./cache');

const src = path.join(__dirname, '../src/');
const build = path.join(__dirname, '../build/node/');

setImmediate(() => {
  console.log('Compiling for SSR with babel');
  const args = [src, '--config-file', path.resolve(src, './.babelrc.node.js'), '--copy-files', '-d', build, '--watch'];
  spawn('babel', args, { env: process.env, stdio: 'inherit' });
});

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', {});

let isTranspiled = false;
const clearTranspile = () => {
  // remove everything that babel transpiled
  Object.keys(require.cache).forEach((location) => {
    if (location.startsWith(build)) delete require.cache[location];
  });
  // remove all rendered pages from the cache
  clearCache();
  // flag for performance profiling
  isTranspiled = false;
};

// clear client code from the require cache whenever it gets changed
// it'll get loaded off the disk again when the render calls require
const chokidar = require('chokidar');
chokidar.watch(build).on('change', () => {
  if (isTranspiled) clearTranspile();
});

let isFirstTranspile = true;
const requireClient = () => {
  const startTime = performance.now();
  const required = require(path.resolve(build, './server'));
  const endTime = performance.now();
  if (!isTranspiled) console.log(`SSR ${isFirstTranspile ? '' : 're'}load took ${Math.round(endTime - startTime)}ms`);
  isFirstTranspile = false;
  isTranspiled = true;
  return required;
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');

const render = async (url, { AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS }) => {
  const { Page, resetState } = requireClient();
  resetState();

  // don't use <ReactSyntax /> so babel can stay scoped to the src directory
  const page = React.createElement(Page, {
    origin: url.origin,
    route: url.pathname + url.search + url.hash,
    AB_TESTS, 
    API_CACHE,
    ZINE_POSTS,
    HOME_CONTENT,
    SSR_SIGNED_IN,
    EXTERNAL_ROUTES,
  });

  const html = ReactDOMServer.renderToString(page);
  const helmet = Helmet.renderStatic();
  const context = { AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS };
  return { html, helmet, context };
};

module.exports = (url, context) => {
  const key = [
    context.SSR_SIGNED_IN ? 'signed-in' : 'signed-out',
    ...Object.entries(context.AB_TESTS).map(([test, assignment]) => `${test}=${assignment}`),
    url,
  ];
  return getFromCache(key.join(' '), render, url, context)
};
