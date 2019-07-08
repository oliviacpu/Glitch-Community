import React, { useState, useCallback, useContext, createContext } from 'react';

import { useAPI, useAPIHandlers, createAPIHook } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import { getSingleItem, getAllPages } from 'Shared/api';
import { captureException } from 'Utils/sentry';

export const getCollectionWithProjects = async (api, { owner, name }) => {
  const fullUrl = `${encodeURIComponent(owner)}/${name}`;
  try {
    const [collection, projects] = await Promise.all([
      getSingleItem(api, `/v1/collections/by/fullUrl?fullUrl=${fullUrl}`, `${owner}/${name}`),
      getAllPages(api, `/v1/collections/by/fullUrl/projects?limit=100&fullUrl=${fullUrl}`),
    ]);
    return { ...collection, projects };
  } catch (error) {
    if (error && error.response && error.response.status === 404) return null;
    captureException(error);
    return null;
  }
};

async function getCollectionProjectsFromAPI(api, collection, withCacheBust) {
  const cacheBust = withCacheBust ? `&cacheBust=${Date.now()}` : '';
  return getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100${cacheBust}`);
}

const loadingResponse = { status: 'loading' };

function loadCollectionProjects(api, collections, setResponses, withCacheBust) {
  setResponses((prev) => {
    const next = { ...prev };
    for (const { id } of collections) {
      if (!next[id] || !next[id].projects) {
        next[id] = { ...next[id], projects: loadingResponse };
      }
    }
    return next;
  });
  collections.forEach(async (collection) => {
    const projects = await getCollectionProjectsFromAPI(api, collection, withCacheBust);
    setResponses((prev) => ({
      ...prev,
      [collection.id]: {
        ...prev[collection.id],
        projects: { status: 'ready', value: projects },
      },
    }));
  });
}

const CollectionProjectContext = createContext();
const CollectionReloadContext = createContext();

export const CollectionContextProvider = ({ children }) => {
  const [responses, setResponses] = useState({});
  const api = useAPI();

  const getCollectionProjects = useCallback((collection) => {
    if (responses[collection.id] && responses[collection.id].projects) {
      return responses[collection.id].projects;
    }
    loadCollectionProjects(api, [collection], setResponses);
    return loadingResponse;
  }, [responses, api]);

  const reloadCollectionProjects = useCallback((collections) => {
    loadCollectionProjects(api, collections, setResponses, true);
  }, [api]);

  return (
    <CollectionProjectContext.Provider value={getCollectionProjects}>
      <CollectionReloadContext.Provider value={reloadCollectionProjects}>
        {children}
      </CollectionReloadContext.Provider>
    </CollectionProjectContext.Provider>
  );
};

export const useCollectionContext = () => useContext(CollectionProjectContext);

export function useCollectionProjects(collection) {
  const getCollectionProjects = useContext(CollectionProjectContext);
  return getCollectionProjects(collection);
}

export function useCollectionReload() {
  const reloadCollectionProjects = useContext(CollectionReloadContext);
  return reloadCollectionProjects;
}

export const useCollectionCurator = createAPIHook(async (api, collection) => {
  if (collection.teamId > 0) {
    const team = await getSingleItem(api, `/v1/teams/by/id?id=${collection.teamId}`, collection.teamId);
    return { team };
  }
  if (collection.userId > 0) {
    const user = await getSingleItem(api, `/v1/users/by/id?id=${collection.userId}`, collection.userId);
    return { user };
  }
  return {};
});

export function userOrTeamIsAuthor({ collection, user }) {
  if (!user) return false;
  if (collection.teamId > 0) {
    return user.teams ? user.teams.some((team) => team.id === collection.teamId) : false;
  }
  if (collection.userId > 0) {
    return user.id === collection.userId;
  }
  return false;
}

export function useCollectionEditor(initialCollection) {
  const [collection, setCollection] = useState(initialCollection);
  const {
    updateItem,
    deleteItem,
    addProjectToCollection,
    orderProjectInCollection,
    removeProjectFromCollection,
    updateProjectInCollection,
  } = useAPIHandlers();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();

  async function updateFields(changes) {
    // A note here: we don't want to setState with the data from the server from this call, as it doesn't return back the projects in depth with users and notes and things
    // maybe a sign we want to think of something a little more powerful for state management, as we're getting a little hairy here.
    setCollection((prev) => ({ ...prev, ...changes }));
    await updateItem({ collection }, changes);
  }

  function updateProject(projectUpdates, project) {
    setCollection((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === project.id) {
          return { ...p, ...projectUpdates };
        }
        return p;
      }),
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    addProjectToCollection: withErrorHandler(async (project, selectedCollection) => {
      if (selectedCollection.id === collection.id) {
        // add project to collection page
        setCollection((prev) => ({
          ...prev,
          projects: [project, ...prev.projects],
        }));
      }
      await addProjectToCollection({ project, collection: selectedCollection });
      if (selectedCollection.id === collection.id) {
        await orderProjectInCollection({ project, collection }, 0);
      }
    }, handleCustomError),

    removeProjectFromCollection: withErrorHandler(async (project) => {
      await removeProjectFromCollection({ project, collection });
      setCollection((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),

    deleteCollection: () => deleteItem({ collection }).catch(handleError),

    updateNameAndUrl: ({ name, url }) => updateFields({ name, url }).catch(handleErrorForInput),

    displayNewNote: (projectId) => updateProject({ isAddingANewNote: true }, projectId),

    updateNote: async ({ note, project }) => {
      note = (note || '').trim();
      await updateProjectInCollection({ project, collection }, { annotation: note });
      updateProject({ note, isAddingANewNote: true }, project);
    },

    hideNote: (project) => updateProject({ isAddingANewNote: false }, project),

    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),

    updateColor: (color) => updateFields({ coverColor: color }),

    updateProjectOrder: withErrorHandler(async (project, filteredIndex) => {
      // the shown projects list doesn't include the featured project, bump the index to include it
      const featuredIndex = collection.projects.findIndex((p) => p.id === collection.featuredProjectId);
      const index = featuredIndex >= 0 && filteredIndex > featuredIndex ? filteredIndex + 1 : filteredIndex;
      setCollection((prev) => {
        const sortedProjects = prev.projects.filter((p) => p.id !== project.id);
        sortedProjects.splice(index, 0, project);
        return { ...prev, projects: sortedProjects };
      });
      await orderProjectInCollection({ project, collection }, index);
    }, handleError),

    featureProject: withErrorHandler(async (project) => {
      if (collection.featuredProjectId) {
        // this is needed to force an dismount of an optimistic state value of a note and to ensure the old featured collection goes where it's supposed to.
        setCollection((prev) => ({ ...prev, featuredProjectId: null }));
      }
      await updateFields({ featuredProjectId: project.id });
    }, handleError),

    unfeatureProject: () => updateFields({ featuredProjectId: null }).catch(handleError),
  };
  return [collection, funcs];
}
