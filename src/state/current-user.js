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

async function load(state) {
  if (this.state.working) return;
  this.setState({ working: true });
  let { sharedUser } = this.props;
  const nextState = {}

  // If we're signed out create a new anon user
  if (!sharedUser) {
    sharedUser = await this.getAnonUser();
    nextState.sharedUser = sharedUser
  }

  // Check if we have to clear the cached user
  if (!usersMatch(sharedUser, this.props.cachedUser)) {
    nextState.cachedUser = cachedUser
  }

  const newCachedUser = await this.getCachedUser();
  if (newCachedUser === 'error') {
    // Looks like our sharedUser is bad, make sure it wasn't changed since we read it
    // Anon users get their token and id deleted when they're merged into a user on sign in
    // If it did change then quit out and let componentDidUpdate sort it out
    if (usersMatch(sharedUser, this.props.sharedUser)) {
      // The user wasn't changed, so we need to fix it
      this.setState({ fetched: false });
      const newSharedUser = await this.getSharedUser();
      this.props.setSharedUser(newSharedUser);
      console.log(`Fixed shared cachedUser from ${sharedUser.id} to ${newSharedUser && newSharedUser.id}`);
      addBreadcrumb({
        level: 'info',
        message: `Fixed shared cachedUser. Was ${JSON.stringify(sharedUser)}`,
      });
      addBreadcrumb({
        level: 'info',
        message: `New shared cachedUser: ${JSON.stringify(newSharedUser)}`,
      });
      captureMessage('Invalid cachedUser');
    }
  } else {
    // The shared user is good, store it
    this.props.setCachedUser(newCachedUser);
    this.setState({ fetched: true });
  }

  this.setState({ working: false });
}

const asyncFunctionMiddleware = before(
  (x) => 'then' in x,
  (store, action) => {
  
  }
)

const loadMiddleware before([actions.requestedLoad], (store, action) => {
  if (store.getState().currentUser.isLoading) { return }
  
})


const onUserChange = before([actions.loaded], (store, action) => {
  const { payload } = action;
  if (!usersMatch(payload, store.getState().currentUser)) {
    identifyUser(payload);
  }

  return action;
});

export const middleware = [loadMiddleware, onUserChange, asyncFunctionMiddleware];
