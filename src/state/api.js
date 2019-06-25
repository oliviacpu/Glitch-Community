/* globals API_URL */
import React, { useState, useEffect, useContext, useRef, useMemo, createContext } from 'react';
import axios from 'axios';
import { memoize } from 'lodash';
import { useCurrentUser } from './current-user';
import { captureException } from '../utils/sentry';

export const Context = createContext();

export const getAPIForToken = memoize((persistentToken) => {
  const cache = {};
  const maxAge = 60 * 1000;
  let api;
  if (persistentToken) {
    api = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  } else {
    api = axios.create({
      baseURL: API_URL,
    });
  }

  return {
    ...api,
    persistentToken,
    get: (url, config) => {
      // TODO: support params
      if (config) return api.get(url, config);
      const now = Date.now();
      if (cache[url] && cache[url].timestamp + maxAge > now) {
        return cache[url].response;
      }
      const response = api.get(url);
      cache[url] = {
        timestamp: now,
        response,
      };
      return response;
    },
  };
});

export function APIContextProvider({ children }) {
  const { persistentToken } = useCurrentUser();
  const api = getAPIForToken(persistentToken);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}

/*
Create a hook for working with the API via async functions.
Usage:
const useTeamsAPI = createAPIHook(async (api, teamID) => {
  const team = await api.get(`/team/${teamID}`);
  const { projectIDs } = team;
  team.projects = await Promise.all(projectIDs.map(projectID => api.get(`/project/${projectID})`));
  return team;
});
function TeamWithProjects ({ teamID }) {
  const { status, value } = useTeamsAPI(teamID)
  if (status === 'loading') {
    return <Loading />
  }
  // ... render the team ...
}
*/

// we don't want to set "stale" state, e.g. if the user clicks over to a different team's page
// while the first team's data is still loading, we don't want to show the first team's data when it loads.
// this should also avoid errors from setting state on an unmounted component.
function useAsyncEffectState(initialState, handler, asyncFuncArgs) {
  const [state, setState] = useState(initialState);
  const versionRef = useRef(0);
  useEffect(() => {
    const versionWhenEffectStarted = versionRef.current;
    const setStateIfFresh = (value) => {
      if (versionWhenEffectStarted === versionRef.current) {
        setState(value);
      }
    };
    handler(setStateIfFresh, versionWhenEffectStarted);
    return () => {
      versionRef.current += 1;
    };
  }, asyncFuncArgs);
  return state;
}

export const createAPIHook = (asyncFunction, options = {}) => (...args) => {
  const api = useAPI();
  const loading = { status: 'loading' };
  const result = useAsyncEffectState(
    loading,
    async (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      try {
        const value = await asyncFunction(api, ...args);
        setResult({ status: 'ready', value });
      } catch (error) {
        setResult({ status: 'error', error });
        if (options.captureException) {
          captureException(error);
        }
      }
    },
    args,
  );
  return result;
};

const entityPath = ({ user, team }) => (user ? `users/${user.id}` : `teams/${team.id}`);

export const useAPIHandlers = () => {
  const api = useAPI();
  return useMemo(
    () => ({
      // collections
      addProjectToCollection: ({ project, collection }) => api.patch(`/collections/${collection.id}/add/${project.id}`),
      orderProjectInCollection: ({ project, collection }, index) => api.post(`/collections/${collection.id}/project/${project.id}/index/${index}`),
      updateProjectInCollection: ({ project, collection }, data) => api.patch(`/collections/${collection.id}/project/${project.id}`, data),
      removeProjectFromCollection: ({ project, collection }) => api.patch(`/collections/${collection.id}/remove/${project.id}`),
      updateCollection: ({ collection }, changes) => api.patch(`/collections/${collection.id}`, changes),
      deleteCollection: ({ collection }) => api.delete(`/collections/${collection.id}`),
      // projects
      updateProject: ({ project }, changes) => api.patch(`/projects/${project.id}`, changes),
      deleteProject: ({ project }) => api.delete(`/projects/${project.id}`),
      removeUserFromProject: ({ project, user }) => api.delete(`/projects/${project.id}/authorization`, { data: { targetUserId: user.id } }),
      updateProjectDomain: ({ project }) =>
        api.post(
          `/project/domainChanged?projectId=${project.id}&authorization=${api.persistentToken}`,
          {},
          {
            transformRequest: (data, headers) => {
              // this endpoint doesn't like OPTIONS requests, which axios sends if there is an auth header (case 3328590)
              delete headers.Authorization;
              return data;
            },
          },
        ),
      getDeletedProject: ({ project }) => api.get(`/projects/${project.id}?showDeleted=true`),
      undeleteProject: ({ project }) => api.post(`/projects/${project.id}/undelete`),

      // teams
      updateTeam: ({ team }, changes) => api.patch(`/teams/${team.id}`, changes),
      joinTeam: ({ team }) => api.post(`/teams/${team.id}/join`),
      inviteEmailToTeam: ({ team }, emailAddress) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { emailAddress }),
      inviteUserToTeam: ({ team, user }) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { userId: user.id }),
      updateUserAccessLevel: ({ user, team }, accessLevel) => api.patch(`/teams/${team.id}/users/${user.id}`, { access_level: accessLevel }),
      removeUserFromTeam: ({ user, team }) => api.delete(`/teams/${team.id}/users/${user.id}`),
      addProjectToTeam: ({ project, team }) => api.post(`/teams/${team.id}/projects/${project.id}`),
      removeProjectFromTeam: ({ project, team }) => api.delete(`/teams/${team.id}/projects/${project.id}`),
      addUserToProject: ({ project, team }) => api.post(`/teams/${team.id}/projects/${project.id}/join`),

      // teams / users
      addPinnedProject: ({ project, team, user }) => api.post(`/${entityPath({ team, user })}/pinned-projects/${project.id}`),
      removePinnedProject: ({ project, team, user }) => api.delete(`/${entityPath({ team, user })}/pinned-projects/${project.id}`),

      // users
      updateUser: ({ user }, changes) => api.patch(`/users/${user.id}`, changes),
    }),
    [api],
  );
};
