import React, { useState, useEffect } from 'react';
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
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  }
  if (!a && !b) {
    return true;
  }
  return false;
}

async function getAnonUser(api) {
  const { data } = await api.post('users/anon');
  return data;
}

async function getSharedUser(api, persistentToken) {
  if (!persistentToken) return undefined;
  
  try {
    return await getSingleItem(api, `v1/users/by/persistentToken?persistentToken=${persistentToken}`, persistentToken);
  } catch (error) {
    if (error.response && error.response.status === 401) return undefined;
    throw error;
  }
}

async function getCachedUser(api, sharedUser) {
  if (!sharedUser) return undefined;
  if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
  try {
    const makeUrl = (type) => `v1/users/by/id/${type}?id=${sharedUser.id}&limit=100`;
    const makeOrderedUrl = (type, order, direction) => `${makeUrl(type)}&orderKey=${order}&orderDirection=${direction}`;
    const {
      baseUser, emails, projects, teams, collections,
    } = await allByKeys({
      baseUser: getSingleItem(api, `v1/users/by/id?id=${sharedUser.id}`, sharedUser.id),
      emails: getAllPages(api, makeUrl('emails')),
      projects: getAllPages(api, makeOrderedUrl('projects', 'domain', 'ASC')),
      teams: getAllPages(api, makeOrderedUrl('teams', 'url', 'ASC')),
      collections: getAllPages(api, makeUrl('collections')),
    });
    const user = { ...baseUser, emails, projects: sortProjectsByLastAccess(projects), teams, collections };
    if (!usersMatch(sharedUser, user)) {
      return 'error';
    }
    return user;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // 401 means our token is bad, 404 means the user doesn't exist
      return 'error';
    }
    throw error;
  }
}

// This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is what we actually display

class CurrentUserManager extends React.Component {

  componentDidUpdate(prev) {
    const { cachedUser, sharedUser } = this.props;

    if (!usersMatch(cachedUser, prev.cachedUser)) {
      identifyUser(cachedUser);
    }

    if (!usersMatch(cachedUser, sharedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
      // delay loading a moment so both items from storage have a chance to update
      setTimeout(() => this.load(), 1);
    }

    // hooks for easier debugging
    window.currentUser = cachedUser;
    window.api = this.api();
  }
}

const getSuperUserHelpers = (api, cachedUser) => {
  const superUserFeature = cachedUser && cachedUser.features && cachedUser.features.find((feature) => feature.name === 'super_user');

  return {
    toggleSuperUser: async () => {
      await api.post(`https://support-toggle.glitch.me/support/${superUserFeature ? 'disable' : 'enable'}`);
      window.scrollTo(0, 0);
      window.location.reload();
    },
    canBecomeSuperUser: cachedUser && cachedUser.projects && cachedUser.projects.filter((p) => p.id === 'b9f7fbdd-ac07-45f9-84ea-d484533635ff').length > 0,
    superUserFeature,
  };
}

export const CurrentUserProvider = ({ children }) => {
  const [state, setState] = useState({
    fetched: false, // Set true on first complete load
    working: false, // Used to prevent simultaneous loading
  })
  const [sharedUser, setSharedUser] = useLocalStorage('cachedUser', null);
  const [cachedUser, setCachedUser] = useLocalStorage('community-cachedUser', null);
  
  const persistentToken = sharedUser ? sharedUser.persistentToken : null;
  const api = getAPIForToken(persistentToken);
  
  const load = async () => {
    if (state.working) return;
    setState({ working: true });
    let sharedOrAnonUser = sharedUser;

    // If we're signed out create a new anon user
    if (!sharedOrAnonUser) {
      sharedOrAnonUser = await getAnonUser(api);
      setSharedUser(sharedOrAnonUser);
    }

    // Check if we have to clear the cached user
    if (!usersMatch(sharedOrAnonUser, cachedUser)) {
      setCachedUser(undefined);
    }

    const newCachedUser = await getCachedUser(api, sharedUser);
    if (newCachedUser === 'error') {
      // Looks like our sharedUser is bad, make sure it wasn't changed since we read it
      // Anon users get their token and id deleted when they're merged into a user on sign in
      // If it did change then quit out and let componentDidUpdate sort it out
      if (usersMatch(sharedOrAnonUser, sharedUser)) {
        // The user wasn't changed, so we need to fix it
        setState({ fetched: false });
        const newSharedUser = await getSharedUser(api, persistentToken);
        setSharedUser(newSharedUser);
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
      setCachedUser(newCachedUser);
      setState({ fetched: true });
    }

    setState({ working: false });
  }
  
  useEffect(() => {
    identifyUser(cachedUser);
    load();
  }, []);
  
  const userProps = {
    currentUser: { ...defaultUser, ...sharedUser, ...cachedUser },
    persistentToken,
    fetched: !!cachedUser && state.fetched,
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
    superUserHelpers: getSuperUserHelpers(api, cachedUser),
  };
  
  return <Context.Provider value={userProps}>{children}</Context.Provider>
};
CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCurrentUser = () => React.useContext(Context);
