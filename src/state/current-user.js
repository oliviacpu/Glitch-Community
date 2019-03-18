/* globals API_URL */

import { createSlice } from 'redux-starter-kit';
import { before } from 'redux-aop'
import axios from 'axios';
import { configureScope, captureException, captureMessage, addBreadcrumb } from '../utils/sentry';
import { readFromStorage } from './local-storage';

export const blankUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
};

export const { reducer, actions } = createSlice({
  slice: 'currentUser',
  initialState: { 
    sharedUser: local
    cachedUser
  },
  reducers: {
    loaded: (_, { payload }) => payload,
    loggedOut: () => initialState
  }
});

function getAPI({ currentUser }) {
  if (currentUser) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: currentUser.persistentToken,
      },
    });
  }
  return axios.create({
    baseURL: API_URL,
  });
}


function identifyUser(user) {
  const analytics = { window };
  if (user) {
    addBreadcrumb({
      level: 'info',
      message: `Current user is ${JSON.stringify(user)}`,
    });
  } else {
    addBreadcrumb({
      level: 'info',
      message: 'logged out',
    });
  }
  try {
    if (analytics && analytics.identify && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find((email) => email.primary);
      const email = emailObj && emailObj.email;
      analytics.identify(
        user.id,
        {
          name: user.name,
          login: user.login,
          email,
          created_at: user.createdAt,
        },
        { groupId: '0' },
      );
    }
    if (user) {
      configureScope((scope) => {
        scope.setUser({
          id: user.id,
          login: user.login,
        });
      });
    } else {
      configureScope((scope) => {
        scope.setUser({
          id: null,
          login: null,
        });
      });
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  }
  if (!a && !b) {
    return true;
  }
  return false;
}

const onUserChange = before([actions.loaded], (prevState, { payload }) => {
  if (!usersMatch(payload, prevState.currentUser)) {
    identifyUser(payload);
  }
  
  return action
})

export const middleware = [
  onUserChange,
];
