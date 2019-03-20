/* globals EDITOR_URL */

import './polyfills';

// Init our dayjs plugins
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

import React from 'react';
import { render } from 'react-dom';
import convertPlugin from '../shared/dayjs-convert';
import { captureException, configureScope } from './utils/sentry';
import App from './app';

dayjs.extend(relativeTimePlugin);
dayjs.extend(convertPlugin);

// This function is used in index.ejs to set up the app
window.bootstrap = () => {
  if (location.hash.startsWith('#!/')) {
    // eslint-disable-line no-restricted-globals
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

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App />, dom);
};

// Make sure react exists because that's an issue that is happening
try {
  if (!React.Component) {
    throw new Error('React.Component is not defined?');
  }
} catch (error) {
  captureException(error);
}
