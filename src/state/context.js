import React, { createContext, useContext, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';

export const ReduxContext = createContext();

export const Provider = ({ store, children }) => <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;

export const useReduxStore = () => useContext(ReduxContext);

export function useReduxSelector(selector) {
  const store = useReduxStore();
  const [state, setState] = useState(() => selector(store.getState()));
  useEffect(() => {
    return store.subscribe(() => {
      const nextState = selector(store.getState());
      if (nextState !== state) {
        setState(nextState);
      }
    });
  }, [store]);
  return state;
}

export function useActions(actionCreators) {
  const { dispatch } = useReduxStore();
  return bindActionCreators(actionCreators, dispatch);
}
