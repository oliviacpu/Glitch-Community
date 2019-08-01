import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { resetIdCounter } from 'react-tabs';
import { resetUniqueId } from 'Hooks/use-unique-id';
import { GlobalsProvider } from 'State/globals';
import App from './app';

const Page = ({ origin, route, signedIn, EXTERNAL_ROUTES, HOME_CONTENT, ZINE_POSTS }) => (
  <StaticRouter location={route}>
    <GlobalsProvider
      origin={origin}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      ZINE_POSTS={ZINE_POSTS}
      SSR_SIGNED_IN={signedIn}
    >
      <App />
    </GlobalsProvider>
  </StaticRouter>
);

const resetState = () => {
  resetIdCounter();
  resetUniqueId();
};

export { Page, resetState };
