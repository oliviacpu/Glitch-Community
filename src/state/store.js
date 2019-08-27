import React from 'react';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import createHandlerMiddleware from './handler-middleware';
import * as currentUser from './current-user';

const store = configureStore({
  reducer: {
    currentUser: currentUser.reducer,
  },
  middleware: [...getDefaultMiddleware(), createHandlerMiddleware(currentUser.handlers)],
  devTools: process.env.NODE_ENV !== 'production',
});

export default ({ children }) => <Provider store={store}>{children}</Provider>;
