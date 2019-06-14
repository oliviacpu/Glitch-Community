/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';

import * as assets from 'Utils/assets';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import useErrorHandlers from '../presenters/error-handlers';
import useUploader from '../presenters/includes/uploader';

const getProject = (api, projectId) => api.get(`projects/${projectId}`);
const getDeletedProject = (api, projectId) => api.get(`projects/${projectId}?showDeleted=true`);
const deleteProject = (api, projectId) => api.delete(`/projects/${projectId}`);
const undeleteProject = (api, projectId) => api.post(`/projects/${projectId}/undelete`);

const getUserCollections = (api, user) => api.get(`collections?userId=${user.id}`);
const addProjectToCollection = (api, project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);

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

  async function reloadCollections() {
    const { data } = await getUserCollections(api, user);
    setState((prev) => ({ ...prev, collections: data }));
  }

  useEffect(() => {
    reloadCollections();
  }, []);

  const withErrorHandler = (fn, handler) => (...args) => fn(args).catch(handler);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateLogin: (login) => updateFields({ login }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await assets.getUserCoverImagePolicy(api, user.id);
          const url = await uploadAsset(blob, policy, 'temporary-user-avatar');

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            avatarUrl: url,
            color,
          });
        }, handleError),
      ),
    uploadCover: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await assets.getUserCoverImagePolicy(api, user.id);
          await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasCoverImage: true,
            coverColor: color,
          });
          setState((prev) => ({ ...prev, _cacheCover: Date.now() }));
        }, handleError),
      ),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addPin: withErrorHandler(async (id) => {
      await api.post(`users/${user.id}/pinned-projects/${id}`);
      setState((prev) => ({
        ...prev,
        pins: [...prev.pins, { id }],
      }));
    }, handleError),
    removePin: withErrorHandler(async (id) => {
      await api.delete(`users/${user.id}/pinned-projects/${id}`);
      setState((prev) => ({
        ...prev,
        pins: prev.pins.filter((p) => p.id !== id),
      }));
    }, handleError),
    leaveProject: withErrorHandler(async (id) => {
      await api.delete(`/projects/${id}/authorization`, {
        data: {
          targetUserId: currentUser.id,
        },
      });
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    }, handleError),
    deleteProject: withErrorHandler(async (projectId) => {
      await deleteProject(api, projectId);
      const { data } = await getDeletedProject(api, projectId);
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
        _deletedProjects: [data, ...prev._deletedProjects], // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    undeleteProject: withErrorHandler(async (projectId) => {
      await undeleteProject(api, projectId);
      const { data } = await getProject(api, projectId);
      // temp set undeleted project updatedAt to now, while it's actually updating behind the scenes
      data.updatedAt = Date.now();
      setState((prev) => ({
        ...prev,
        projects: [data, ...prev.projects],
        _deletedProjects: prev._deletedProjects.filter((p) => p.id !== projectId), // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    setDeletedProjects: (_deletedProjects) => setState((prev) => ({ ...prev, _deletedProjects })),
    addProjectToCollection: withErrorHandler(async (project, collection) => {
      await addProjectToCollection(api, project, collection);
      reloadCollections();
    }, handleCustomError),
    featureProject: (id) => updateFields({ featured_project_id: id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [user, funcs];
}
