/* globals API_URL */

import axios from 'axios';
import { memoize } from 'lodash';
import React, { useContext, useState, useEffect } from 'react';
import { selectPersistentToken } from './current-user';
import { useSelector } from './context';

const getAPIForToken = memoize((persistentToken) => {
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
  return getAPIForToken(selectPersistentToken(state))
}

export function useAPI () {
  const persistentToken = useSelector(selectPersistentToken)
  return getAPIForToken(persistentToken)
}