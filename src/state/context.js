import { createContext, useContext, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';

export const ReduxContext = createContext();

export const useReduxStore = () => useContext(ReduxContext);

export function useSelector(selector) {
  const store = useReduxStore();
  const initState = selector(store.getState());
  const [state, setState] = useState(initState);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextState = selector(store.getState());
      if (nextState !== state) {
        setState(nextState);
      }
    });
    return unsubscribe;
  }, [store]);
  return state;
}

export function useActions(actionCreators) {
  const { dispatch } = useReduxStore();
  return bindActionCreators(actionCreators, dispatch);
}
