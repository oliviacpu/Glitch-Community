import { createContext, useContext, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';

export const ReduxContext = createContext();

export const useReduxStore = () => useContext(ReduxContext);

export function useSelector(selector, ...args) {
  const store = useReduxStore();
  const [state, setState] = useState(selector(store.getState(), ...args));
  useEffect(
    () =>
      store.subscribe(() => {
        const nextState = selector(store.getState(), ...args);
        console.log('nextState', selector.name, nextState)
        if (nextState !== state) {
          setState(nextState);
        }
      }),
    [store],
  );
  console.log('useSelector', selector.name. state)
  return state;
}

export function useActions(actionCreators) {
  const { dispatch } = useReduxStore();
  return bindActionCreators(actionCreators, dispatch);
}
