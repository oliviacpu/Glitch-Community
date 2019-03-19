import { createContext, useContext, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';

export const ReduxContext = createContext();

export const useReduxStore = () => useContext(ReduxContext);

export function useSelector(selector, ...args) {
  const store = useReduxStore();
  const [state, setState] = useState(() => selector(store.getState()));
  useEffect(
    () =>
      store.subscribe(() => {
        const nextState = selector(store.getState(), ...args);
        if (nextState !== state) {
          setState(nextState);
        }
      }),
    [store],
  );
  return state;
}

export function useActions(actionCreators) {
  const { dispatch } = useReduxStore();
  return bindActionCreators(actionCreators, dispatch);
}
