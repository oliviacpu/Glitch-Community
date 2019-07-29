import './polyfills';

// Init our dayjs plugins
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import convertPlugin from 'Shared/dayjs-convert';
import { captureException, configureScope } from 'Utils/sentry';
import { EDITOR_URL } from 'Utils/constants';
import { GlobalsProvider } from 'State/globals';
import App from './app';

dayjs.extend(relativeTimePlugin);
dayjs.extend(convertPlugin);

// This function is used in index.ejs to set up the app
window.bootstrap = () => {
  if (location.hash.startsWith('#!/')) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }
  // Mark that bootstrapping has occurred,
  // ..and more importantly, use this as an excuse
  // to call into Sentry so that its initialization
  // happens early in our JS bundle.
  configureScope((scope) => {
    scope.setTag('bootstrap', 'true');
  });

  const element = (
    <BrowserRouter>
      <GlobalsProvider
        origin={window.location.origin}
        EXTERNAL_ROUTES={window.EXTERNAL_ROUTES}
        HOME_CONTENT={window.HOME_CONTENT}
        ZINE_POSTS={window.ZINE_POSTS}
        SSR_SIGNED_IN={window.SSR_SIGNED_IN}
      >
        <App />
      </GlobalsProvider>
    </BrowserRouter>
  );
  const container = document.getElementById('main');

  if (container.hasChildNodes()) {
    hydrate(element, container);
  } else {
    render(element, container);
  }
};

// Make sure react exists because that's an issue that is happening
try {
  if (!React.Component) {
    throw new Error('React.Component is not defined?');
  }
} catch (error) {
  captureException(error);
}
