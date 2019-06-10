/* globals BUILD_TIMESTAMP, ENVIRONMENT, PROJECT_DOMAIN, _env */

//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file should import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//

import * as Sentry from '@sentry/browser';

export * from '@sentry/browser';
const SentryHelpers = require('../../shared/sentryHelpers');

let beforeSendFailed = false;
let beforeBreadcrumbFailed = false;

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    release: `community@${BUILD_TIMESTAMP}`,
    ignoreErrors: SentryHelpers.ignoreErrors,
    whitelistUrls: ['/glitch.com/'],
    beforeSend(event) {
      // do not send errors to sentry when user uses UC Browser
      const ucBrowser = window.navigator.userAgent.match(/^Mozilla\/5\.0 .+ Gecko\/$/);
      if (ucBrowser) {
        return null;
      }
      try {
        return SentryHelpers.beforeSend(PROJECT_DOMAIN, _env, event);
      } catch (error) {
        console.error(error);
        if (!beforeSendFailed) {
          // It'll probably fail next time too, so only log it once
          // Also let this capture finish before starting another one
          window.setTimeout(() => Sentry.captureException(error), 1);
          beforeSendFailed = true;
        }
        return event;
      }
    },
    beforeBreadcrumb(breadcrumb) {
      try {
        return SentryHelpers.beforeBreadcrumb(breadcrumb);
      } catch (error) {
        if (!beforeBreadcrumbFailed) {
          // the console creates breadcrumbs, don't get into a loop
          console.error(error);
          window.setTimeout(() => Sentry.captureException(error), 1);
          beforeBreadcrumbFailed = true;
        }
        return breadcrumb;
      }
    },
  });

  Sentry.configureScope((scope) => {
    scope.setTag('PROJECT_DOMAIN', PROJECT_DOMAIN);
  });

  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn('Error initializing Sentry', error);
}
