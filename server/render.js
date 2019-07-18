const React = require('react');
const ReactDOMServer = require('react-dom/server');

const render = async (url) => {
  return ReactDOMServer.renderToString(<p>{url}</p>);
};

module.exports = render;
