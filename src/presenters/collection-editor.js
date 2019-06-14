import { useState } from 'react';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useErrorHandlers from '../presenters/error-handlers';

const updateCollection = (api, collection, changes) => api.patch(`collections/${collection.id}`, changes);

function currentUserIsAuthor(currentUser, collection) {
  if (!currentUser) return false;
  if (collection.teamId > 0) {
    return currentUser.teams.some((team) => team.id === collection.teamId);
  }
  if (collection.userId > 0) {
    return currentUser.id === collection.userId;
  }
  return false;
}

export function useCollectionEditor (initialCollection) {
  const [collection, setCollection] = useState(initialCollection) 
  const { currentUser } = useCurrentUser()
  const api = useAPI()
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();

  async function updateFields(changes) {
    // A note here: we don't want to setState with the data from the server from this call, as it doesn't return back the projects in depth with users and notes and things
    // maybe a sign we want to think of something a little more powerful for state management, as we're getting a little hairy here.
    setCollection((prev) => ({ ...prev, ...changes }));
    await updateCollection(api, collection, changes);
  }

  async function addProjectToCollection(project, selectedCollection) {
    if (selectedCollection.id === collection.id) {
      // add project to collection page
      this.setState(({ projects }) => ({
        projects: [project, ...projects],
      }));
    }
    await api.patch(`collections/${selectedCollection.id}/add/${project.id}`);
    if (selectedCollection.id === collection.id) {
      await api.post(`collections/${selectedCollection.id}/project/${project.id}/index/0`);
    }
  }

  async function removeProjectFromCollection(project) {
    await api.patch(`collections/${collection.id}/remove/${project.id}`);
    this.setState(({ projects }) => ({
      projects: projects.filter((p) => p.id !== project.id),
    }));
  }

  async function updateProjectOrder(project, filteredIndex) {
    // the shown projects list doesn't include the featured project, bump the index to include it
    const featuredIndex = collection.projects.findIndex((p) => p.id === collection.featuredProjectId);
    const index = (featuredIndex >= 0 && filteredIndex > featuredIndex) ? filteredIndex + 1 : filteredIndex;
    this.setState(({ projects }) => {
      const sortedProjects = projects.filter((p) => p.id !== project.id);
      sortedProjects.splice(index, 0, project);
      return { projects: sortedProjects };
    });
    await api.post(`collections/${collection.id}/project/${project.id}/index/${index}`);
  }

  async function deleteCollection() {
    await api.delete(`/collections/${collection.id}`);
  }

  async function updateNote({ note, projectId }) {
    note = (note || "").trim();
    await api.patch(`collections/${collection.id}/project/${projectId}`, { annotation: note });
    this.updateProject({ note, isAddingANewNote: true }, projectId);
  }

  function displayNewNote(projectId) {
    this.updateProject({ isAddingANewNote: true }, projectId);
  }

  function hideNote(projectId) {
    this.updateProject({ isAddingANewNote: false }, projectId);
  }

  async function featureProject(id) {
    if (collection.featuredProjectId) {
      // this is needed to force an dismount of an optimistic state value of a note and to ensure the old featured collection goes where it's supposed to.
      this.setState({ featuredProjectId: null });
    }
    await this.updateFields({ featuredProjectId: id });
  }

  function updateProject(projectUpdates, projectId) {
    this.setState(({ projects }) => ({
      projects: projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, ...projectUpdates };
        }
        return { ...project };
      }),
    }));
  }
  
  const withErrorHandler = (fn, handler) => 

  const funcs = {
    addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
    removeProjectFromCollection: (project) => this.removeProjectFromCollection(project).catch(handleError),
    deleteCollection: () => this.deleteCollection().catch(handleError),
    updateNameAndUrl: ({ name, url }) => this.updateFields({ name, url }).catch(handleErrorForInput),
    displayNewNote: (projectId) => this.displayNewNote(projectId),
    updateNote: ({ note, projectId }) => this.updateNote({ note, projectId }),
    hideNote: (projectId) => this.hideNote(projectId),
    updateDescription: (description) => this.updateFields({ description }).catch(handleErrorForInput),
    updateColor: (color) => this.updateFields({ coverColor: color }),
    updateProjectOrder: (project, index) => this.updateProjectOrder(project, index).catch(handleError),
    featureProject: (id) => this.featureProject(id).catch(handleError),
    unfeatureProject: () => updateFields({ featuredProjectId: null }).catch(handleError),
  };
  return [collection, funcs, currentUserIsAuthor(currentUser, collection)];
  
}
