import { useState } from 'react';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useErrorHandlers from '../presenters/error-handlers';

export const addProjectToCollection = (api, projectId, collection) => api.patch(`collections/${collection.id}/add/${projectId}`);
export const orderProjectInCollection = (api, projectId, collection, index) => api.post(`collections/${collection.id}/project/${projectId}/index/${index}`);
export const updateProjectInCollection = (api, projectId, collection, patch) => api.patch(`collections/${collection.id}/project/${projectId}`, patch);
export const removeProjectFromCollection = (api, projectId, collection) => api.patch(`collections/${collection.id}/remove/${projectId}`);

export const updateCollection = (api, collection, changes) => api.patch(`collections/${collection.id}`, changes);
export const deleteCollection = (api, collection) => api.delete(`/collections/${collection.id}`);

export function currentUserIsAuthor(currentUser, collection) {
  if (!currentUser) return false;
  if (collection.teamId > 0) {
    return currentUser.teams.some((team) => team.id === collection.teamId);
  }
  if (collection.userId > 0) {
    return currentUser.id === collection.userId;
  }
  return false;
}

export function useCollectionEditor(initialCollection) {
  const [collection, setCollection] = useState(initialCollection);
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();

  async function updateFields(changes) {
    // A note here: we don't want to setState with the data from the server from this call, as it doesn't return back the projects in depth with users and notes and things
    // maybe a sign we want to think of something a little more powerful for state management, as we're getting a little hairy here.
    setCollection((prev) => ({ ...prev, ...changes }));
    await updateCollection(api, collection, changes);
  }

  function updateProject(projectUpdates, projectId) {
    setCollection((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, ...projectUpdates };
        }
        return { ...project };
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
      await addProjectToCollection(api, project.id, selectedCollection)
      if (selectedCollection.id === collection.id) {
        await orderProjectInCollection(api, project.id, collection, 0)
      }
    }, handleCustomError),

    removeProjectFromCollection: withErrorHandler(async (project) => {
      await removeProjectFromCollection(api, project.id, collection)
      setCollection((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),

    deleteCollection: () => deleteCollection(api, collection).catch(handleError),

    updateNameAndUrl: ({ name, url }) => updateFields({ name, url }).catch(handleErrorForInput),

    displayNewNote: (projectId) => updateProject({ isAddingANewNote: true }, projectId),

    updateNote: async ({ note, projectId }) => {
      note = (note || '').trim();
      await updateProjectInCollection(api, projectId, collection, { annotation: note });
      updateProject({ note, isAddingANewNote: true }, projectId);
    },

    hideNote: (projectId) => updateProject({ isAddingANewNote: false }, projectId),

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
      await orderProjectInCollection(api, project.id, collection, index);
    }, handleError),

    featureProject: withErrorHandler(async (projectId) => {
      if (collection.featuredProjectId) {
        // this is needed to force an dismount of an optimistic state value of a note and to ensure the old featured collection goes where it's supposed to.
        setCollection((prev) => ({ ...prev, featuredProjectId: null }));
      }
      await updateFields({ featuredProjectId: projectId });
    }, handleError),

    unfeatureProject: () => updateFields({ featuredProjectId: null }).catch(handleError),
  };
  return [collection, funcs, currentUserIsAuthor(currentUser, collection)];
}
