import { Context as CurrentUserContext } from 'State/current-user';
import { Context as APIContext } from 'State/api';
import { Context as UserPrefsContext } from 'State/user-prefs';
import { Context as DevTogglesContext } from 'State/dev-toggles';

/* eslint-disable import/prefer-default-export */

import React, { useState } from 'react';

export const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  };
  return () => <WrappedComponent />;
};

const log = console.log.bind(console);

const defaultUserPrefs = {
  prefs: {},
  set: log,
};

const defaultDevToggles = {
  enabledToggles: [],
  toggleData: log,
  setEnabledToggles: log,
};

export const provideContext = (
  { userPrefs = defaultUserPrefs, devToggles = defaultDevToggles, currentUser = {}, currentUserFetched = true, api = {} } = {},
  Component,
) => () => (
  <UserPrefsContext.Provider value={userPrefs}>
    <DevTogglesContext.Provider value={devToggles}>
      <CurrentUserContext.Provider value={{ currentUser, fetched: currentUserFetched }}>
        <APIContext.Provider value={api}>
          <Component />
        </APIContext.Provider>
      </CurrentUserContext.Provider>
    </DevTogglesContext.Provider>
  </UserPrefsContext.Provider>
);
