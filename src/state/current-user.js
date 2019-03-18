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
    isLoading: false,
  },
  reducers: {
    requestedLoad: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    loaded: (state, { payload }) => ({
      ...state,
      isLoading: false,
      ...payload,
    }),
    loggedIn: (state, { payload }) => ({
      ...state,
      sharedUser: payload,
      cachedUser: undefined,
    }),
    updated: (state, { payload }) => ({
      ...state,
      cachedUser: {
        ...state.cachedUser,
        ...payload,
      },
    }),
    loggedOut: (state) => ({
      ...state,
      sharedUser: null,
      cachedUser: null,
    }),
  },
});

const onLoad = before([actions.requestedLoad], (store, action) => {
  // prevent multiple 'load's from running
  if (store.getState().currentUser.isLoading) {
    return null;
  }

  load(store.getState()).then((result) => {
    store.dispatch(actions.loaded(result));
  });

  return action;
});

const onUserChange = before([actions.loaded], (store, action) => {
  const { payload } = action;
  if (!usersMatch(payload, store.getState().currentUser)) {
    identifyUser(payload);
  }

  return action;
});

export const middleware = [onLoad, onUserChange];


// utilities

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

async function load(state) {
  let { sharedUser, cachedUser } = state.currenUser;
  const nextState = { sharedUser, cachedUser };

  // If we're signed out create a new anon user
  if (!sharedUser) {
    nextState.sharedUser = await getAnonUser(state);
  }

  // Check if we have to clear the cached user
  if (!usersMatch(sharedUser, cachedUser)) {
    nextState.cachedUser = undefined;
  }

  const newCachedUser = await getCachedUser(state);
  if (newCachedUser === 'error') {
    // Looks like our sharedUser is bad, make sure it wasn't changed since we read it
    // Anon users get their token and id deleted when they're merged into a user on sign in
    // If it did change then quit out and let componentDidUpdate sort it out
    if (usersMatch(nextState.sharedUser, sharedUser)) {
      // The user wasn't changed, so we need to fix it
      nextState.sharedUser = await getSharedUser(state);
      console.log(`Fixed shared cachedUser from ${sharedUser.id} to ${nextState.sharedUser && nextState.sharedUser.id}`);
      addBreadcrumb({
        level: 'info',
        message: `Fixed shared cachedUser. Was ${JSON.stringify(sharedUser)}`,
      });
      addBreadcrumb({
        level: 'info',
        message: `New shared cachedUser: ${JSON.stringify(nextState.sharedUser)}`,
      });
      captureMessage('Invalid cachedUser');
    }
  } else {
    // The shared user is good, store it
    nextState.cachedUser = newCachedUser;
  }

  return nextState;
}