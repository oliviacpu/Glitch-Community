const path = require('path');

module.exports = (SRC) => ({
  Components: path.resolve(SRC, './components'),
  Utils: path.resolve(SRC, './utils'),
  Curated: path.resolve(SRC, './curated'),
  Models: path.resolve(SRC, './models'),
  State: path.resolve(SRC, './state'),
  Hooks: path.resolve(SRC, './hooks'),
  Shared: path.resolve(__dirname),
});
