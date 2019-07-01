import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { getSingleItem, getAllPages, allByKeys } from 'Shared/api';
import { sortProjectsByLastAccess } from 'Models/project';
import { configureScope, captureException, captureMessage, addBreadcrumb } from 'Utils/sentry';
import useLocalStorage from './local-storage';
import { getAPIForToken } from './api';

export const Context = React.createContext();

// Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do
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
  if (!a && !b) return true;
  return a && b && a.id === b.id && a.persistentToken === b.persistentToken;
}

async function getAnonUser() {
  const api = getAPIForToken();
  const { data } = await api.post('users/anon');
  return data;
}

async function getSharedUser(persistentToken) {
  if (!persistentToken) return undefined;
  const api = getAPIForToken(persistentToken);

  try {
    return await getSingleItem(api, `v1/users/by/persistentToken?persistentToken=${persistentToken}`, persistentToken);
  } catch (error) {
    if (error.response && error.response.status === 401) return undefined;
    throw error;
  }
}

async function getCachedUser(sharedUser) {
  if (!sharedUser) return undefined;
  if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
  const api = getAPIForToken(sharedUser.persistentToken);
  try {
    const makeUrl = (type) => `v1/users/by/id/${type}?id=${sharedUser.id}&limit=100`;
    const makeOrderedUrl = (type, order, direction) => `${makeUrl(type)}&orderKey=${order}&orderDirection=${direction}`;
    const {
      baseUser, emails, projects, teams, collections,
    } = await allByKeys({
      baseUser: getSingleItem(api, `v1/users/by/id?id=${sharedUser.id}&cache=${Date.now()}`, sharedUser.id),
      emails: getAllPages(api, makeUrl('emails')),
      projects: getAllPages(api, makeOrderedUrl('projects', 'domain', 'ASC')),
      teams: getAllPages(api, makeOrderedUrl('teams', 'url', 'ASC')),
      collections: getAllPages(api, makeUrl('collections')),
    });
    const user = { ...baseUser, emails, projects: sortProjectsByLastAccess(projects), teams, collections };
    if (!usersMatch(sharedUser, user)) return 'error';
    return user;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // 401 means our token is bad, 404 means the user doesn't exist
      return 'error';
    }
    throw error;
  }
}

const getSuperUserHelpers = (cachedUser) => {
  const superUserFeature = cachedUser && cachedUser.features && cachedUser.features.find((feature) => feature.name === 'super_user');

  return {
    toggleSuperUser: async () => {
      if (!cachedUser) return;
      const api = getAPIForToken(cachedUser.persistentToken);
      await api.post(`https://support-toggle.glitch.me/support/${superUserFeature ? 'disable' : 'enable'}`);
      window.scrollTo(0, 0);
      window.location.reload();
    },
    canBecomeSuperUser:
      cachedUser && cachedUser.projects && cachedUser.projects.filter((p) => p.id === 'b9f7fbdd-ac07-45f9-84ea-d484533635ff').length > 0,
    superUserFeature,
  };
};

const logSharedUserError = (sharedUser, newSharedUser) => {
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
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useDebouncedAsync = (fn) => {
  const [working, setWorking] = useState(false); // Used to prevent simultaneous loading
  return async (...args) => {
    if (working) return;
    setWorking(true);
    // delay loading a moment so both items from storage have a chance to update
    await sleep(1);
    await fn(...args);
    setWorking(false);
  };
};

export const CurrentUserProvider = ({ children }) => {
  const [fetched, setFetched] = useState(false); // Set true on first complete load

  // sharedUser syncs with the editor and is authoritative on id and persistentToken
  const [sharedUser, setSharedUser] = useLocalStorage('cachedUser', null);
  // put sharedUser in a ref so that we can access its current value in load(),
  // even if it was changed elsewhwere
  const sharedUserRef = useRef(sharedUser);
  useEffect(() => {
    sharedUserRef.current = sharedUser;
  }, [sharedUser]);

  // cachedUser mirrors GET /users/{id} and is what we actually display
  const [cachedUser, setCachedUser] = useLocalStorage('community-cachedUser', null);

  const persistentToken = sharedUser ? sharedUser.persistentToken : null;

  const load = useDebouncedAsync(async () => {
    let sharedOrAnonUser = sharedUser;

    // If we're signed out create a new anon user
    if (!sharedOrAnonUser) {
      sharedOrAnonUser = await getAnonUser();
      setSharedUser(sharedOrAnonUser);
    }

    // Check if we have to clear the cached user
    if (!usersMatch(sharedOrAnonUser, cachedUser)) {
      setCachedUser(undefined);
    }

    const newCachedUser = await getCachedUser(sharedOrAnonUser);

    if (newCachedUser === 'error') {
      // Looks like our sharedUser is bad, make sure it wasn't changed since we read it
      // Anon users get their token and id deleted when they're merged into a user on sign in
      // If it did change then quit out and let useEffect sort it out
      if (usersMatch(sharedOrAnonUser, sharedUserRef.current)) {
        // The user wasn't changed, so we need to fix it
        setFetched(false);
        const newSharedUser = await getSharedUser(sharedOrAnonUser.persistentToken);
        setSharedUser(newSharedUser);
        logSharedUserError(sharedUser, newSharedUser);
      }
    } else {
      // The shared user is good, store it
      setCachedUser(newCachedUser);
      setFetched(true);
    }
  });

  useEffect(() => {
    identifyUser(cachedUser);
  }, [cachedUser && cachedUser.id, cachedUser && cachedUser.persistentToken]);

  useEffect(() => {
    load();
    // for easier debugging
    window.currentUser = cachedUser;
  }, [cachedUser && cachedUser.id, cachedUser && cachedUser.persistentToken, sharedUser && sharedUser.id, sharedUser && sharedUser.persistentToken]);

  const userProps = {
    currentUser: { ...defaultUser, ...sharedUser, ...cachedUser },
    persistentToken,
    fetched: !!cachedUser && fetched,
    reload: load,
    login: (data) => {
      setSharedUser(data);
      setCachedUser(undefined);
    },
    update: (changes) => {
      setCachedUser({ ...cachedUser, ...changes });
    },
    clear: () => {
      setSharedUser(undefined);
      setCachedUser(undefined);
    },
    superUserHelpers: getSuperUserHelpers(cachedUser),
  };

  return <Context.Provider value={userProps}>{children}</Context.Provider>;
};
CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCurrentUser = () => React.useContext(Context);
