import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { getDefaultMiddleware } from 'redux-starter-kit';
import * as currentUser from './current-user';
import { ReduxContext } from './context';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers({
    currentUser: currentUser.reducer,
  }),
  composeEnhancers(applyMiddleware(...getDefaultMiddleware(), ...currentUser.middleware)),
);

const Provider = ({ children }) => <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;

export default Provider;
