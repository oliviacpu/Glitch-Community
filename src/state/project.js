/* eslint-disable import/prefer-default-export */
import { useState } from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';
import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';
import useErrorHandlers from './error-handlers';
import useUploader from './includes/uploader';

export function useProjectEditor(initialProject) {
  const [project, setProject] = useState({
    ...initialProject,
    _avatarCache: Date.now(),
  });
  const { currentUser } = useCurrentUser();
  const { uploadAsset } = useUploader();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const api = useAPI();

  function userIsMember() {
    if (!currentUser) return false;
    // TODO: use permissions
    return project.users.some(({ id }) => currentUser.id === id);
  }

  async function updateFields(changes) {
    await api.patch(`projects/${project.id}`, changes);
    setProject((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  async function updateDomain(domain) {
    await updateFields({ domain });
    // don't await this because the project domain has already changed and I don't want to delay other things updating
    api.post(
      `project/domainChanged?projectId=${project.id}&authorization=${currentUser.persistentToken}`,
      {},
      {
        transformRequest: (data, headers) => {
          // this endpoint doesn't like OPTIONS requests, which axios sends if there is an auth header (case 3328590)
          delete headers.Authorization;
          return data;
        },
      },
    );
  }

  async function addProjectToCollection(project, collection) {
    await api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async function deleteProject() {
    await api.delete(`projects/${project.id}`);
  }

  async function uploadAvatar(blob) {
    const { data: policy } = await assets.getProjectAvatarImagePolicy(api, project.id);
    await uploadAsset(blob, policy, '', { cacheControl: 60 });
    setProject((prev) => ({
      ...prev,
      _avatarCache: Date.now(),
    }));
  }

  const funcs = {
    addProjectToCollection: (project, collection) => addProjectToCollection(project, collection).catch(handleCustomError),
    deleteProject: () => deleteProject().catch(handleError),
    updateDomain: (domain) => updateDomain(domain).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    updatePrivate: (isPrivate) => updateFields({ private: isPrivate }).catch(handleError),
    uploadAvatar: () => assets.requestFile((blob) => uploadAvatar(blob).catch(handleError)),
  };
  return [project, funcs, userIsMember()];
}
