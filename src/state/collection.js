import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';

import { useAPI, useAPIHandlers, createAPIHook } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import { getSingleItem, getAllPages } from 'Shared/api';
import { captureException } from 'Utils/sentry';
import { createCollection, getCollectionLink } from 'Models/collection';
import { AddProjectToCollectionMsg } from 'Components/notification';
import { useNotifications } from 'State/notifications';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';

async function getCollectionProjectsFromAPI(api, collection, withCacheBust) {
  const url = `/v1/collections/by/id/projects?id=${collection.id}&orderKey=projectOrder&limit=100`;

  if (withCacheBust) {
    // busts cache for collection projects by id
    api.bustCache(url);
  }

  // then get the latest collection projects
  return getAllPages(api, url);
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

// we mock out the projects for the placeholder my stuff collections
const initialResponses = { nullMyStuff: { projects: { status: 'ready', value: [] } } };

export const CollectionContextProvider = ({ children }) => {
  const [responses, setResponses] = useState(initialResponses);
  const api = useAPI();

  const getCollectionProjects = useCallback(
    (collection) => {
      if (responses[collection.id] && responses[collection.id].projects) {
        return responses[collection.id].projects;
      }
      loadCollectionProjects(api, [collection], setResponses);
      return loadingResponse;
    },
    [responses, api],
  );

  const reloadCollectionProjects = useCallback(
    (collections) => {
      loadCollectionProjects(api, collections, setResponses, true);
    },
    [api],
  );

  return (
    <CollectionProjectContext.Provider value={getCollectionProjects}>
      <CollectionReloadContext.Provider value={reloadCollectionProjects}>{children}</CollectionReloadContext.Provider>
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

// used by featured-project and pages/project
export const useToggleBookmark = (project) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const reloadCollectionProjects = useCollectionReload();

  const myStuffEnabled = useDevToggle('My Stuff');
  const { createNotification } = useNotifications();

  const { addProjectToCollection, removeProjectFromCollection } = useAPIHandlers();

  const [hasBookmarked, setHasBookmarked] = useState(project.authUserHasBookmarked);
  useEffect(() => {
    setHasBookmarked(project.authUserHasBookmarked);
  }, [project.authUserHasBookmarked]);

  const toggleBookmarked = async () => {
    try {
      let myStuffCollection = currentUser.collections.find((c) => c.isMyStuff);
      if (hasBookmarked) {
        setHasBookmarked(false);
        await removeProjectFromCollection({ project, collection: myStuffCollection });
        createNotification(`Removed ${project.domain} from collection My Stuff`);
      } else {
        setHasBookmarked(true);
        if (!myStuffCollection) {
          myStuffCollection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled });
        }
        await addProjectToCollection({ project, collection: myStuffCollection });
        const url = myStuffCollection.fullUrl || `${currentUser.login}/${myStuffCollection.url}`;
        createNotification(<AddProjectToCollectionMsg projectDomain={project.domain} collectionName="My Stuff" url={`/@${url}`} />, {
          type: 'success',
        });
      }
      reloadCollectionProjects([myStuffCollection]);
    } catch (error) {
      captureException(error);
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
    }
  };
  return [hasBookmarked, toggleBookmarked, setHasBookmarked];
};

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

  React.useEffect(() => {
    setCollection(initialCollection);
  }, [initialCollection]);

  const {
    updateItem,
    deleteItem,
    addProjectToCollection,
    orderProjectInCollection,
    removeProjectFromCollection,
    updateProjectInCollection,
  } = useAPIHandlers();
  const api = useAPI();

  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const reloadCollectionProjects = useCollectionReload();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

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
      // if it's the same collection as the page you're on, add the project to it
      if (selectedCollection.id === collection.id) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: [project, ...oldCollection.projects],
        }));
      }

      // if you're adding to a project to the my stuff collection, make sure the project shows as bookmarked
      if (selectedCollection.isMyStuff) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.map((p) => {
            if (p.id === project.id) {
              p.authUserHasBookmarked = true;
            }
            return p;
          }),
        }));
      }

      // make backend call
      await addProjectToCollection({ project, collection: selectedCollection });

      // reorder collection if necessary
      if (selectedCollection.id === collection.id) {
        await orderProjectInCollection({ project, collection }, 0);
      }

      // reload collection projects, this will ensure next time we navigate to this page, the state is up to date and caches are busted if necessary
      reloadCollectionProjects([selectedCollection, collection]);
    }, handleCustomError),

    removeProjectFromCollection: withErrorHandler(async (project, selectedCollection) => {
      // if no collection is passed in, assume the current page is the collection we're removing from
      if (!selectedCollection.id) {
        selectedCollection = collection;
      }

      // if collection we're removing from is same as current collection page, remove it from the page
      if (selectedCollection.id === collection.id) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.filter((p) => p.id !== project.id),
        }));
      }

      // if we're unbookmarking a project in a collection, make sure it shows as unbookmarked
      if (selectedCollection.isMyStuff) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.map((p) => {
            if (p.id === project.id) {
              p.authUserHasBookmarked = false;
            }
            return p;
          }),
        }));
      }

      // make api call to remove from collection
      await removeProjectFromCollection({ project, collection: selectedCollection });

      // reload collection projects, this will ensure next time we navigate to this page, the state is up to date and caches are busted if necessary
      reloadCollectionProjects([selectedCollection, collection]);
    }, handleError),

    deleteCollection: () => deleteItem({ collection }).catch(handleError),

    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      setCollection((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),

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

    // used on the collection page
    toggleBookmark: withErrorHandler(async (project) => {
      let myStuffCollection = currentUser.collections.find((c) => c.isMyStuff);
      if (project.authUserHasBookmarked) {
        await funcs.removeProjectFromCollection(project, myStuffCollection);
        createNotification(`Removed ${project.domain} from collection My Stuff`);
      } else {
        if (!myStuffCollection) {
          myStuffCollection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled: true });
        }
        await funcs.addProjectToCollection(project, myStuffCollection);
        createNotification(
          <AddProjectToCollectionMsg projectDomain={project.domain} collectionName="My Stuff" url={getCollectionLink(myStuffCollection)} />,
          {
            type: 'success',
          },
        );
      }
    }, handleError),
  };
  return [collection, funcs];
}
