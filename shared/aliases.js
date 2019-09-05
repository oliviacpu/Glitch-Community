const path = require('path');

module.exports = (SRC) => ({
  Components: path.resolve(__dirname, SRC, './components'),
  Utils: path.resolve(__dirname, SRC, './utils'),
  Curated: path.resolve(__dirname, SRC, './curated'),
  Models: path.resolve(__dirname, SRC, './models'),
  State: path.resolve(__dirname, SRC, './state'),
  Hooks: path.resolve(__dirname, SRC, './hooks'),
  Shared: path.resolve(__dirname),
});
