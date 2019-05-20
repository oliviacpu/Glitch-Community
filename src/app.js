import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AnalyticsContext } from 'State/segment-analytics';
import { CurrentUserProvider } from 'State/current-user';
import { APIContextProvider } from 'State/api';
import { UserPrefsProvider } from 'State/user-prefs';
import { DevTogglesProvider } from 'State/dev-toggles';
import ErrorBoundary from './presenters/includes/error-boundary';
import { Notifications } from './presenters/notifications';
import SuperUserBanner from './presenters/overlays/super-user-banner';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <AnalyticsContext context={{ groupId: '0' }}>
              <CurrentUserProvider>
                <APIContextProvider>
                  <>
                    <SuperUserBanner />
                    <Router />
                  </>
                </APIContextProvider>
              </CurrentUserProvider>
            </AnalyticsContext>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
