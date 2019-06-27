import { useState } from 'react';

import * as assets from 'Utils/assets';
import { useAPI, useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useUploader from 'State/uploader';
import useErrorHandlers from 'State/error-handlers';
<<<<<<< HEAD
import { getSingleItem } from 'Shared/api';

function useUserPageGetters() {
  const api = useAPI();
  return {
    getUserCollections: ({ user }) => api.get(`collections?userId=${user.id}`),
    getDeletedProject: ({ project }) => api.get(`/projects/${project.id}?showDeleted=true`),
    getProject: ({ project }) => getSingleItem(api, `/v1/projects/by/id?id=${project.id}`, project.id),
  };
}
=======
import { useCollectionReload } from 'State/collection';

export const addPin = (api, projectId, user) => api.post(`users/${user.id}/pinned-projects/${projectId}`);
export const removePin = (api, projectId, user) => api.delete(`users/${user.id}/pinned-projects/${projectId}`);
export const leaveProject = (api, projectId, user) =>
  api.delete(`/projects/${projectId}/authorization`, {
    data: {
      targetUserId: user.id,
    },
  });

export const getProject = (api, projectId) => api.get(`projects/${projectId}`);
export const getDeletedProject = (api, projectId) => api.get(`projects/${projectId}?showDeleted=true`);
export const deleteProject = (api, projectId) => api.delete(`/projects/${projectId}`);
export const undeleteProject = (api, projectId) => api.post(`/projects/${projectId}/undelete`);

export const addProjectToCollection = (api, project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);
>>>>>>> ca8dcd64905faebab897409078ff9c6a661d22ed

// eslint-disable-next-line import/prefer-default-export
export function useUserEditor(initialUser) {
  const [user, setUser] = useState({
    ...initialUser,
    _deletedProjects: [],
  });
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAsset, uploadAssetSizes } = useUploader();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
<<<<<<< HEAD
  const { getCoverImagePolicy } = assets.useAssetPolicy();
  const {
    updateItem,
    deleteItem,
    removeUserFromProject,
    addPinnedProject,
    removePinnedProject,
    undeleteProject,
    addProjectToCollection,
  } = useAPIHandlers();
  const { getUserCollections, getDeletedProject, getProject } = useUserPageGetters();
=======
  const reloadCollectionProjects = useCollectionReload();
>>>>>>> ca8dcd64905faebab897409078ff9c6a661d22ed

  const isCurrentUser = !!currentUser && user.id === currentUser.id;

  async function updateFields(changes) {
    const { data } = await updateItem({ user }, changes);
    setUser((prev) => ({ ...prev, ...data }));
    if (isCurrentUser) {
      updateCurrentUser(data);
    }
  }

<<<<<<< HEAD
  async function reloadCollections() {
    const { data } = await getUserCollections({ user });
    setUser((prev) => ({ ...prev, collections: data }));
  }

  useEffect(() => {
    reloadCollections();
  }, []);

=======
>>>>>>> ca8dcd64905faebab897409078ff9c6a661d22ed
  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateLogin: (login) => updateFields({ login }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getCoverImagePolicy({ user }); // TODO: why not 'getAvatarImagePolicy' here?
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
          const { data: policy } = await getCoverImagePolicy({ user });
          await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasCoverImage: true,
            coverColor: color,
          });
          setUser((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleError),
      ),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addPin: withErrorHandler(async (project) => {
      await addPinnedProject({ project, user });
      setUser((prev) => ({
        ...prev,
        pins: [...prev.pins, { id: project.id }],
      }));
    }, handleError),
    removePin: withErrorHandler(async (project) => {
      await removePinnedProject({ project, user });
      setUser((prev) => ({
        ...prev,
        pins: prev.pins.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    leaveProject: withErrorHandler(async (project) => {
      await removeUserFromProject({ project, user: currentUser });
      setUser((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      const { data } = await getDeletedProject({ project });
      setUser((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
        _deletedProjects: [data, ...prev._deletedProjects], // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    undeleteProject: withErrorHandler(async (project) => {
      await undeleteProject({ project });
      const data = await getProject({ project });
      // temp set undeleted project updatedAt to now, while it's actually updating behind the scenes
      data.updatedAt = Date.now();
      setUser((prev) => ({
        ...prev,
        projects: [data, ...prev.projects],
        _deletedProjects: prev._deletedProjects.filter((p) => p.id !== project.id), // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    setDeletedProjects: (_deletedProjects) => setUser((prev) => ({ ...prev, _deletedProjects })),
    addProjectToCollection: withErrorHandler(async (project, collection) => {
<<<<<<< HEAD
      await addProjectToCollection({ project, collection });
      reloadCollections();
=======
      await addProjectToCollection(api, project, collection);
      reloadCollectionProjects([collection]);
>>>>>>> ca8dcd64905faebab897409078ff9c6a661d22ed
    }, handleCustomError),
    featureProject: (project) => updateFields({ featured_project_id: project.id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [user, funcs];
}
