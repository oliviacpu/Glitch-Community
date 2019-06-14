import { useState } from 'react';

import * as assets from 'Utils/assets';
import { useAPI } from 'State/api';
import { allByKeys, getSingleItem, getAllPages } from 'Shared/api';

import useErrorHandlers from '../presenters/error-handlers';
import useUploader from '../presenters/includes/uploader';

export async function getProjectByDomain(api, domain) {
  const { project, teams, users } = await allByKeys({
    project: getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain),
    teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });
  return { ...project, teams, users };
}

export const updateProject = (api, project, changes) => api.patch(`projects/${project.id}`, changes);

export const addProjectToCollection = (api, project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);

export const deleteProject = (api, project) => api.delete(`projects/${project.id}`);

export const updateProjectDomain = (api, project) =>
  api.post(
    `project/domainChanged?projectId=${project.id}&authorization=${api.persistentToken}`,
    {},
    {
      transformRequest: (data, headers) => {
        // this endpoint doesn't like OPTIONS requests, which axios sends if there is an auth header (case 3328590)
        delete headers.Authorization;
        return data;
      },
    },
  );

export function useProjectEditor(initialProject) {
  const [project, setProject] = useState({
    ...initialProject,
    _avatarCache: Date.now(),
  });
  const { uploadAsset } = useUploader();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const api = useAPI();

  async function updateFields(changes) {
    await updateProject(api, project, changes);
    setProject((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    addProjectToCollection: (collection) => addProjectToCollection(api, project, collection).catch(handleCustomError),
    deleteProject: () => deleteProject(api, project).catch(handleError),
    updateDomain: withErrorHandler(async (domain) => {
      await updateFields({ domain });
      // don't await this because the project domain has already changed and I don't want to delay other things updating
      updateProjectDomain(api, project);
    }, handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    updatePrivate: (isPrivate) => updateFields({ private: isPrivate }).catch(handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await assets.getProjectAvatarImagePolicy(api, project.id);
          await uploadAsset(blob, policy, '', { cacheControl: 60 });
          setProject((prev) => ({
            ...prev,
            _avatarCache: Date.now(),
          }));
        }, handleError),
      ),
  };
  return [project, funcs];
}
