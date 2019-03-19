import React from 'react';
import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { reducer as currentUser, middleware as currentUserMiddleware } from './current-user';
import { ReduxContext } from './context';

export const store = configureStore({
  reducers: 
  middleware: [...getDefaultMiddleware(), ...currentUserMiddleware],
  devTools: true,
});

const Provider = ({ children }) => <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;

export default Provider;
