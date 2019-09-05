const path = require('path');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const createCache = require('./cache');

const { spawn } = require('child_process');
const src = path.join(__dirname, '../src/');
const build = path.join(__dirname, '../build/node/');
//spawn('pnpx', ['babel', src, '--no-babelrc', '--config-file', path.join(src, './.babelrc.node.js'), '-d', build], { env: process.env, stdio: 'inherit' });

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', {});

// clear client code from the require cache whenever it gets changed
// it'll get loaded off the disk again when the render calls require
let isTranspileNeeded = false;
const chokidar = require('chokidar');
chokidar.watch(build).on('change', () => {
  // remove everything that babel transpiled
  Object.keys(require.cache).forEach((location) => {
    if (location.startsWith(build)) delete require.cache[location];
  });
  // remove all rendered pages from the cache
  clearCache();
  // flag for performance profiling
  isTranspileNeeded = false;
});

let isFirstTranspile = true;
const requireClient = () => {
  if (!isTranspileNeeded) console.log(`${isFirstTranspile ? 'T' : 'Ret'}ranspiling for SSR...`);
  const startTime = performance.now();
  const required = require(path.join(build, './server'));
  const endTime = performance.now();
  if (!isTranspileNeeded) console.log(`SSR ${isFirstTranspile ? '' : 're'}transpile took ${Math.round(endTime - startTime) / 1000}s`);
  isFirstTranspile = false;
  isTranspileNeeded = true;
  return required;
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
setImmediate(() => requireClient()); // transpile right away rather than waiting for a request

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
