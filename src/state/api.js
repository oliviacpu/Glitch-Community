/* globals API_URL */

import axios from 'axios';
import { memoize } from 'lodash';
import React, { useContext, useState, useEffect } from 'react';
import { selectPersistentToken } from './current-user';

const selectAPI = memoize((persistentToken) => {
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

export function getAPI (state) {
  return selectAPI(selectPersistentToken(state))
}

export function useAPI () {
  const persistentToken = useSelector(selectPersistentToken)
  const api = selectAPI(
}