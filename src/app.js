import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AnalyticsContext } from 'State/segment-analytics';
import { CurrentUserProvider } from 'State/current-user';
import { APIContextProvider } from 'State/api';
import { UserPrefsProvider } from 'State/user-prefs';
import { DevTogglesProvider } from 'State/dev-toggles';
import OfflineNotice from 'State/offline-notice';
import SuperUserBanner from 'Components/banners/super-user';
import { LiveAnnouncer } from 'react-aria-live';

import ErrorBoundary from './presenters/includes/error-boundary';
import { Notifications } from './presenters/notifications';
import Router from './presenters/pages/router';
console.log('asdf');
const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <LiveAnnouncer>
              <AnalyticsContext context={{ groupId: '0' }}>
                <CurrentUserProvider>
                  <APIContextProvider>
                    <>
                      <SuperUserBanner />
                      <OfflineNotice />
                      <Router />
                    </>
                  </APIContextProvider>
                </CurrentUserProvider>
              </AnalyticsContext>
            </LiveAnnouncer>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
