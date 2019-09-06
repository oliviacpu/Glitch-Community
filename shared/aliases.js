const path = require('path');

const makeAliases = (SRC) => ({
  Components: path.resolve(__dirname, SRC + 'components'),
  Utils: path.resolve(__dirname, SRC + 'utils'),
  Curated: path.resolve(__dirname, SRC + 'curated'),
  Models: path.resolve(SRC + 'models'),
  State: path.resolve(SRC + 'state'),
  Hooks: path.resolve(SRC + 'hooks'),
  Shared: path.resolve(__dirname),
});

const clientPath = path.resolve('../src/');
const builtPath = path.resolve(__dirname, '../build/node/');

let serverPath = clientPath;
if (process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'ci') {
  serverPath = builtPath;
}

module.exports = {
  server: makeAliases(serverPath),
  client: makeAliases(clientPath),
};
