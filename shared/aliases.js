const path = require('path');

const makeAliases = (SRC) => ({
  Components: path.resolve(__dirname, SRC + 'components'),
  Utils: path.resolve(__dirname, SRC + 'utils'),
  Curated: path.resolve(__dirname, SRC + 'curated'),
  Models: path.resolve(__dirname, SRC + 'models'),
  State: path.resolve(__dirname, SRC + 'state'),
  Hooks: path.resolve(__dirname, SRC + 'hooks'),
  Shared: path.resolve(__dirname),
});

const clientPath = '/src/';
const builtPath = '../build/node/';

let serverPath = clientPath;
if (process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'ci') {
  serverPath = builtPath;
}

module.exports = {
  server: makeAliases(serverPath),
  client: makeAliases(clientPath),
};
