import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { resetIdCounter } from 'react-tabs';
import { resetUniqueId } from 'Hooks/use-unique-id';
import { GlobalsProvider } from 'State/globals';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';

const Page = ({ origin, helmetContext, route, AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS }) => (
  <StaticRouter location={route}>
    <GlobalsProvider
      origin={origin}
      AB_TESTS={AB_TESTS}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      SSR_SIGNED_IN={SSR_SIGNED_IN}
      ZINE_POSTS={ZINE_POSTS}
    >
      <HelmetProvider>
        <App apiCache={API_CACHE} />
      </HelmetProvider>
    </GlobalsProvider>
  </StaticRouter>
);

const resetState = () => {
  resetIdCounter();
  resetUniqueId();
};

export { Page, resetState };
