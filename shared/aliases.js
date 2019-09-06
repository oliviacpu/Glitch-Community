const path = require('path');

const makeAliases = (SRC) => ({
  Components: path.join(SRC, './components'),
  Utils: path.join(SRC, './utils'),
  Curated: path.join(SRC, './curated'),
  Models: path.join(SRC, './models'),
  State: path.join(SRC, './state'),
  Hooks: path.join(SRC, './hooks'),
  Shared: __dirname,
});

const clientPath = path.join(__dirname, '../src/');
const builtPath = path.join(__dirname, '../build/node/');

let serverPath = clientPath;
if (process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'ci') {
  serverPath = builtPath;
}

module.exports = {
  server: makeAliases(serverPath),
  client: makeAliases(clientPath),
};
