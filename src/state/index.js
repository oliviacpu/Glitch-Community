import React from 'react';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import * as currentUser from './current-user';
import { ReduxContext } from './context';

export const store = configureStore({
  reducers: {
    currentUser: currentUser.reducer,
  },
  middleware: [...getDefaultMiddleware(), ...currentUser.middleware],
  devTools: true,
});

const Provider = ({ children }) => <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;

export default Provider;
