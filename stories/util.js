/* eslint-disable import/prefer-default-export */

import React, { useState } from 'react';

export const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  };
  return () => <WrappedComponent />;
};

export const provideContext = ({ currentUser = {}, api = {} } = {}, Component) => () => (
  <CurrentUserContext.Provider value={{ currentUser }}>
    <APIContext.Provider value={api}>
      <Component />
    </APIContext.Provider>
  </CurrentUserContext.Provider>
);