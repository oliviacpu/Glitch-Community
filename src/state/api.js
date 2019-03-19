/* globals API_URL */

import axios from 'axios';
import { memoize } from 'lodash';
import { selectPersistentToken } from './current-user';
import { useSelector } from './context';

export const getAPIForToken = memoize((persistentToken) => {
  if (persistentToken) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  }
  return axios.create({
    baseURL: API_URL,
  });
})

export function getAPI(state) {
  return getAPIForToken(selectPersistentToken(state));
}

export function useAPI() {
  const persistentToken = useSelector(selectPersistentToken);
  console.log('useAPI', persistentToken)
  return getAPIForToken(persistentToken);
}
