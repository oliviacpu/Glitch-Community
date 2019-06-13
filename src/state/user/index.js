/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';

import * as assets from 'Utils/assets';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import useErrorHandlers from '../../presenters/error-handlers';
import useUploader from '../../presenters/includes/uploader';

export function useUserEditor(initialUser) {
  const [user, setState] = useState({
    ...initialUser,
    _cacheCover: Date.now(),
    _deletedProjects: [],
  });
  const api = useAPI();
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAsset, uploadAssetSizes } = useUploader();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();

  const isCurrentUser = !!currentUser && user.id === currentUser.id;

  async function updateFields(changes) {
    const { data } = await api.patch(`users/${user.id}`, changes);
    setState((prev) => ({ ...prev, ...data }));
    if (isCurrentUser) {
      updateCurrentUser(data);
    }
  }

  async function uploadAvatar(blob) {
    const { data: policy } = await assets.getUserCoverImagePolicy(api, user.id);
    const url = await uploadAsset(blob, policy, 'temporary-user-avatar');

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      avatarUrl: url,
      color,
    });
  }

  async function uploadCover(blob) {
    const { data: policy } = await assets.getUserCoverImagePolicy(api, user.id);
    await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    setState((prev) => ({ ...prev, _cacheCover: Date.now() }));
  }

  async function addPin(id) {
    await api.post(`users/${user.id}/pinned-projects/${id}`);
    setState((prev) => ({
      ...prev,
      pins: [...prev.pins, { id }],
    }));
  }

  async function removePin(id) {
    await api.delete(`users/${user.id}/pinned-projects/${id}`);
    setState((prev) => ({
      ...prev,
      pins: prev.pins.filter((p) => p.id !== id),
    }));
  }

  async function leaveProject(id) {
    await api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: currentUser.id,
      },
    });
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }

  async function deleteProject(id) {
    await api.delete(`/projects/${id}`);
    const { data } = await api.get(`projects/${id}?showDeleted=true`);
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      _deletedProjects: [data, ...prev._deletedProjects], // eslint-disable-line no-underscore-dangle
    }));
  }

  async function undeleteProject(id) {
    await api.post(`/projects/${id}/undelete`);
    const { data } = await api.get(`projects/${id}`);
    // temp set undeleted project updatedAt to now, while it's actually updating behind the scenes
    data.updatedAt = Date.now();
    setState((prev) => ({
      ...prev,
      projects: [data, ...prev.projects],
      _deletedProjects: prev._deletedProjects.filter((p) => p.id !== id), // eslint-disable-line no-underscore-dangle
    }));
  }

  async function reloadCollections() {
    const { data } = await api.get(`collections?userId=${user.id}`);
    setState((prev) => ({ ...prev, collections: data }));
  }

  async function addProjectToCollection(project, collection) {
    await api.patch(`collections/${collection.id}/add/${project.id}`);
    reloadCollections();
  }

  async function featureProject(id) {
    await updateFields({ featured_project_id: id });
  }

  async function unfeatureProject() {
    await updateFields({ featured_project_id: null });
  }

  useEffect(() => {
    reloadCollections();
  }, []);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateLogin: (login) => updateFields({ login }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    uploadAvatar: () => assets.requestFile((blob) => uploadAvatar(blob).catch(handleError)),
    uploadCover: () => assets.requestFile((blob) => uploadCover(blob).catch(handleError)),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addPin: (id) => addPin(id).catch(handleError),
    removePin: (id) => removePin(id).catch(handleError),
    leaveProject: (id) => leaveProject(id).catch(handleError),
    deleteProject: (id) => deleteProject(id).catch(handleError),
    undeleteProject: (id) => undeleteProject(id).catch(handleError),
    setDeletedProjects: (_deletedProjects) => setState((prev) => ({ ...prev, _deletedProjects })),
    addProjectToCollection: (project, collection) => addProjectToCollection(project, collection).catch(handleCustomError),
    featureProject: (id) => featureProject(id).catch(handleError),
    unfeatureProject: (id) => unfeatureProject(id).catch(handleError),
  };
  return [user, funcs];
}
