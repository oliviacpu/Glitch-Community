/* globals API_URL */

import { createSlice } from 'redux-starter-kit';
import { before } from 'redux-aop';
import axios from 'axios';
import { configureScope, captureException, captureMessage, addBreadcrumb } from '../utils/sentry';
import { readFromStorage } from './local-storage';

// TODO: This manages _both_ the users login information and their profile data.
// Once we're managing user profiles in redux, these can probably be separated.

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
    sharedUser: readFromStorage('currentUser') || null,
    cachedUser: readFromStorage('community-cachedUser') || null,
  },
  reducers: {
    loaded: (_, { payload }) => payload,
    loggedIn: (_, { payload }) => ({ sharedUser: payload, cachedUser: undefined }),
    updated: (state, { payload }) => ({
      ...state,
      cachedUser: {
        ...state.cachedUser,
        ...payload,
      },
    }),
    loggedOut: () => ({ sharedUser: null, cachedUser: null }),
  },
});

function getAPI(state) {
  if (state.currentUser.sharedUser) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: state.currentUser.sharedUser.persistentToken,
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

async function getAnonUser(state) {
  const { data } = await getAPI(state).post('users/anon');
  return data;
}

async function getSharedUser(state) {
  try {
    const {
      data: { user },
    } = await getAPI(state).get('boot?latestProjectOnly=true');
    return user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return undefined;
    }
    throw error;
  }
}

async function getCachedUser(state) {
  const { sharedUser } = state.currentUser;
  if (!sharedUser) return undefined;
  if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
  try {
    const { data } = await getAPI(state).get(`users/${sharedUser.id}`);
    if (!usersMatch(sharedUser, data)) {
      return 'error';
    }
    return data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // 401 means our token is bad, 404 means the user doesn't exist
      return 'error';
    }
    throw error;
  }
}

const onUserChange = before([actions.loaded], (prevState, action) => {
  const { payload } = action;
  if (!usersMatch(payload, prevState.currentUser)) {
    identifyUser(payload);
  }

  return action;
});

export const middleware = [onUserChange];
