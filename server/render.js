const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { StaticRouter } = require('react-router');

const render = async (url) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <p>{url}</p>
    </StaticRouter>
  );
};

module.exports = render;
