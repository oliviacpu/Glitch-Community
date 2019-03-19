import { createSlice } from 'redux-starter-kit';
import { before, after } from 'redux-aop';
import { get } from 'lodash';
import { configureScope, captureException, captureMessage, addBreadcrumb } from '../utils/sentry';
import { readFromStorage } from './local-storage';
import { getAPI, useAPI } from './api';
import { useSelector, useActions } from './context';

// utilities

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

// TODO: this whole system is kind of gnarly. What is this _supposed_ to do?
async function load(state) {
  const { sharedUser, cachedUser } = state.currenUser;
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
    // If it did change then quit out and let onUserChange sort it out
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

// TODO: This manages _both_ the users login information and their profile data.
// Once we're managing user profiles in redux, these can probably be separated.

// reducer

const defaultUser = {
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
    loadState: 'init', // init | loading \ ready
  },
  reducers: {
    requestedLoad: (state) => ({
      ...state,
      loadState: 'loading',
    }),
    loaded: (state, { payload }) => ({
      ...state,
      ...payload,
      loadState: 'ready',
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

// selectors

export const selectLoadState = (state) => state.currentUser.loadState;

export const selectPersistentToken = (state) => get(state, ['currentUser', 'sharedUser', 'persistentToken']);

export function selectCurrentUser(state) {
  const { sharedUser, cachedUser } = state.currentUser;
  return { ...defaultUser, ...sharedUser, ...cachedUser };
}

// middleware

const matchTypes = (...actionCreators) => actionCreators.map(String);

// TODO: should this be kicked off by the UI mounting?
let didInit = false;
const onInit = after((store, action) => {
  if (!didInit) {
    didInit = true;
    store.dispatch(actions.requestedLoad());
  }
  return action;
});

const onLoad = before(matchTypes(actions.requestedLoad), (store, action) => {
  const currentState = store.getState();
  // prevent multiple 'load's from running
  if (selectLoadState(currentState) === 'loading') {
    return null;
  }

  load(currentState).then((result) => {
    store.dispatch(actions.loaded(result));
  });

  return action;
});

const onUserChange = before(matchTypes(...Object.values(actions)), (store, action) => {
  const prev = store.getState().currentUser;
  const { cachedUser, sharedUser } = action.payload;

  if (!usersMatch(cachedUser, prev.cachedUser)) {
    identifyUser(cachedUser);
  }

  if (!usersMatch(cachedUser, sharedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
    // delay loading a moment so both items from storage have a chance to update
    setTimeout(() => {
      store.dispatch(actions.requestedLoad());
    }, 1);
  }

  // hooks for easier debugging
  // TODO: is this necessary with the redux dev tools?
  window.currentUser = cachedUser;

  return action;
});

export const middleware = [onInit, onLoad, onUserChange];

// connectors
// TODO: `api` and actions don't need to be in here, do they?
// TODO: what is `fetched` actually used for?

export function useLegacyCurrentUser() {
  const currentUser = useSelector(selectCurrentUser);
  const loadState = useSelector(selectLoadState);
  const api = useAPI();
  const boundActions = useActions(actions);

  return {
    api,
    currentUser,
    fetched: loadState === 'ready',
    reload: boundActions.loadRequested,
    login: boundActions.loggedIn,
    update: boundActions.updated,
    clear: boundActions.loggedOut,
  };
}
