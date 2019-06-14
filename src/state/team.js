import { useState } from 'react';

import * as assets from 'Utils/assets';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';

import useErrorHandlers from '../presenters/error-handlers';
import useUploader from '../presenters/includes/uploader';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const updateTeam = (api, team, changes) => api.patch(`teams/${team.id}`, changes);
const joinTeam = (api, team) => api.post(`teams/${team.id}/join`);

async function inviteEmail(api, emailAddress, team) {
  await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
    emailAddress,
  });
}

async function inviteUserToTeam(api, user, team) {
  await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
    userId: user.id,
  });
}
const updateUserAccessLevel = (api, userId, team, accessLevel) =>
  api.patch(`teams/${team.id}/users/${userId}`, {
    access_level: accessLevel,
  });
const removeUserFromTeam = (api, userId, team) => api.delete(`teams/${team.id}/users/${userId}`);

const deleteProject = (api, projectId) => api.delete(`/projects/${projectId}`);

const addProjectToTeam = (api, project, team) => api.post(`teams/${team.id}/projects/${project.id}`);
const removeProjectFromTeam = (api, projectId, team) => api.delete(`teams/${team.id}/projects/${projectId}`);

const addPinnedProject = (api, projectId, team) => api.post(`teams/${team.id}/pinned-projects/${projectId}`);
const removePinnedProject = (api, projectId, team) => api.delete(`teams/${team.id}/pinned-projects/${projectId}`);

async function addProjectToCollection(api, project, collection) {
  await api.patch(`collections/${collection.id}/add/${project.id}`);
}

async function addUserToProject(api, projectId, team) {
  await api.post(`/teams/${team.id}/projects/${projectId}/join`);
}

async function removeUserFromProject(api, projectId, userId) {
  await api.delete(`/projects/${projectId}/authorization`, {
    data: {
      targetUserId: userId,
    },
  });
}

export function useTeamEditor(initialTeam) {
  const api = useAPI();
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const [team, setTeam] = useState({
    ...initialTeam,
    _cacheAvatar: Date.now(),
    _cacheCover: Date.now(),
  });

  async function updateFields(changes) {
    const { data } = await updateTeam(api, team, changes);
    setTeam((prev) => ({ ...prev, ...data }));
    if (currentUser) {
      const teamIndex = currentUser.teams.findIndex(({ id }) => id === team.id);
      if (teamIndex >= 0) {
        const teams = [...currentUser.teams];
        teams[teamIndex] = team;
        updateCurrentUser({ teams });
      }
    }
  }

  async function uploadAvatar(blob) {
    const { data: policy } = await assets.getTeamAvatarImagePolicy(api, team.id);
    await uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
    setTeam((prev) => ({ ...prev, _cacheAvatar: Date.now() }));
  }

  async function uploadCover(blob) {
    const { data: policy } = await assets.getTeamCoverImagePolicy(api, team.id);
    await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    setTeam((prev) => ({ ...prev, _cacheCover: Date.now() }));
  }

  function removeUserAdmin(id) {
    const index = team.adminIds.indexOf(id);
    if (index !== -1) {
      setTeam((prev) => ({
        ...prev,
        counter: prev.adminIds.splice(index, 1),
      }));
    }
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    joinTeam: withErrorHandler(async () => {
      await joinTeam(api, team);
      setTeam((prev) => ({
        ...prev,
        users: [...prev.users, currentUser],
      }));
      if (currentUser) {
        const { teams } = currentUser;
        updateCurrentUser({ teams: [...teams, team] });
      }
    }, handleError),
    inviteEmail: (email) => inviteEmail(api, email, team).catch(handleError),
    inviteUser: () => inviteUserToTeam(api, currentUser, team).catch(handleError),
    removeUserFromTeam: withErrorHandler(async (userId, projectIds) => {
      // Kick them out of every project at once, and wait until it's all done
      await Promise.all(projectIds.map((projectId) => removeUserFromProject(api, projectId, userId)));
      // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
      await removeUserFromTeam(api, userId, team);
      removeUserAdmin(userId);
      setTeam((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
      }));
      if (currentUser && currentUser.id === userId) {
        const teams = currentUser.teams.filter(({ id }) => id !== team.id);
        updateCurrentUser({ teams });
      }
    }, handleError),
    uploadAvatar: () => assets.requestFile((blob) => uploadAvatar(blob).catch(handleError)),
    uploadCover: () => assets.requestFile((blob) => uploadCover(blob).catch(handleError)),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: withErrorHandler(async (project) => {
      await addProjectToTeam(api, project, team);
      setTeam((prev) => ({
        ...prev,
        projects: [project, ...prev.projects],
      }));
    }, handleError),
    removeProject: withErrorHandler(async (projectId) => {
      await removeProjectFromTeam(api, projectId, team);
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));
    }, handleError),
    deleteProject: withErrorHandler(async (projectId) => {
      await deleteProject(api, projectId);
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));
    }, handleError),
    addPin: withErrorHandler(async (projectId) => {
      await addPinnedProject(api, projectId, team);
      setTeam((prev) => ({
        ...prev,
        teamPins: [...prev.teamPins, { projectId }],
      }));
    }, handleError),
    removePin: withErrorHandler(async (projectId) => {
      await removePinnedProject(api, projectId, team);
      setTeam((prev) => ({
        ...prev,
        teamPins: prev.teamPins.filter((p) => p.projectId !== projectId),
      }));
    }, handleError),
    updateWhitelistedDomain: (whitelistedDomain) => updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: withErrorHandler(async (userId, accessLevel) => {
      if (accessLevel === MEMBER_ACCESS_LEVEL && team.adminIds.length <= 1) {
        createNotification('A team must have at least one admin', { type: 'error' });
        return false;
      }
      await updateUserAccessLevel(api, userId, team, accessLevel);
      if (accessLevel === ADMIN_ACCESS_LEVEL) {
        setTeam((prev) => ({
          ...prev,
          counter: prev.adminIds.push(userId),
        }));
      } else {
        removeUserAdmin(userId);
      }
      return null;
    }, handleError),
    joinTeamProject: (projectId) => addUserToProject(api, projectId, team).catch(handleError),
    leaveTeamProject: (projectId) => removeUserFromProject(api, projectId, currentUser.id).catch(handleError),
    addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection).catch(handleCustomError),
    featureProject: (id) => updateFields({ featured_project_id: id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [team, funcs];
}
