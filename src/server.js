import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { GlobalsProvider } from 'State/globals';
import App from './app';

const Page = ({ origin, route, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => (
  <StaticRouter location={route}>
    <GlobalsProvider
      origin={origin}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      ZINE_POSTS={ZINE_POSTS}
    >
      <App />
    </GlobalsProvider>
  </StaticRouter>
);

export default Page;
