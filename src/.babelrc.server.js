const stylus = require('stylus');

module.exports = {
    only: [(location) => location.startsWith(src)],
    presets: [
      '@babel/preset-react',
      ['@babel/preset-env', { targets: { node: true }, useBuiltIns: false }],
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
  };
  