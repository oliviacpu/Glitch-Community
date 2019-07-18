const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { StaticRouter } = require('react-router');
const { GlobalsProvider } = require('State/globals');

const Link = require('Components/link');

const { getZine } = require('./api');
const { getHomeData } = require('./home');

const render = async (origin, url) => {
  const [zine, homeContent] = await Promise.all([getZine(), getHomeData()]);
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <GlobalsProvider origin={origin} ZINE_POSTS={zine} HOME_CONTENT={homeContent} EXTERNAL_ROUTES={[]}>
        <p><Link to="/@Greg">asdf</Link></p>
      </GlobalsProvider>
    </StaticRouter>
  );
};

module.exports = render;
