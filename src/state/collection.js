import { useState } from 'react';

import { useAPIHandlers } from 'State/api';
import useErrorHandlers from 'State/error-handlers';

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
      await addProjectToCollection({ project, selectedCollection });
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
