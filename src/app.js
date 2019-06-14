import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AnalyticsContext } from 'State/segment-analytics';
import { CurrentUserProvider } from 'State/current-user';
import { APIContextProvider } from 'State/api';
import { UserPrefsProvider } from 'State/user-prefs';
import { DevTogglesProvider } from 'State/dev-toggles';
import { ProjectContextProvider } from 'State/project';
import { NotificationsProvider } from 'State/notifications';
import OfflineNotice from 'State/offline-notice';
import SuperUserBanner from 'Components/banners/super-user';
import { LiveAnnouncer } from 'react-aria-live';

import ErrorBoundary from './presenters/includes/error-boundary';
import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <NotificationsProvider>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <LiveAnnouncer>
              <AnalyticsContext context={{ groupId: '0' }}>
                <CurrentUserProvider>
                  <APIContextProvider>
                    <ProjectContextProvider>
                      <>
                        <SuperUserBanner />
                        <OfflineNotice />
                        <Router />
                      </>
                    </ProjectContextProvider>
                  </APIContextProvider>
                </CurrentUserProvider>
              </AnalyticsContext>
            </LiveAnnouncer>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </NotificationsProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
