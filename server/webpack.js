function webpackBackgroundProcess() {
  // Launch webpack in a separate process because it blocks a bit
  const { spawn } = require('child_process');
  const env = { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' };
  spawn('webpack', ['--watch', '--info-verbosity', 'verbose'], { env, stdio: 'inherit' });
}

function webpackExpressMiddleware() {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  const compiler = webpack(webpackConfig);

  const webpackMiddleware = require('webpack-dev-middleware');
  const stats = { children: false };
  return webpackMiddleware(compiler, { stats, writeToDisk: true });
}

module.exports = function(app) {
  if (process.env.NODE_ENV === 'production') {
    webpackBackgroundProcess();
  } else {
    app.use(webpackExpressMiddleware());
  }
};