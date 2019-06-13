/* eslint-disable import/prefer-default-export */
import { useState } from 'react';

import * as assets from 'Utils/assets';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';

import useErrorHandlers from '../presenters/error-handlers';
import useUploader from '../presenters/includes/uploader';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

// "legacy" setState behavior
function useMergeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const mergeState = (fnOrValue) => {
    if (typeof fnOrValue === 'function') {
      setState((prev) => ({ ...prev, ...fnOrValue(prev) }));
    } else {
      setState((prev) => ({ ...prev, ...fnOrValue }));
    }
  };
  return [state, mergeState];
}

export function useTeamEditor(initialTeam) {
  const api = useAPI();
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const [team, mergeTeam] = useMergeState({
    ...initialTeam,
    _cacheAvatar: Date.now(),
    _cacheCover: Date.now(),
  });

  async function updateFields(changes) {
    const { data } = await api.patch(`teams/${team.id}`, changes);
    mergeTeam(data);
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
    mergeTeam({ _cacheAvatar: Date.now() });
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
    mergeTeam({ _cacheCover: Date.now() });
  }

  async function joinTeam() {
    await api.post(`teams/${team.id}/join`);
    mergeTeam(({ users }) => ({
      users: [...users, currentUser],
    }));
    if (currentUser) {
      const { teams } = currentUser;
      updateCurrentUser({ teams: [...teams, team] });
    }
  }

  async function inviteEmail(emailAddress) {
    console.log('💣 inviteEmail', emailAddress);
    await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
      emailAddress,
    });
  }

  async function inviteUser(user) {
    console.log('💣 inviteUser', user);
    await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
      userId: user.id,
    });
  }

  function removeUserAdmin(id) {
    const index = team.adminIds.indexOf(id);
    if (index !== -1) {
      mergeTeam((prevState) => ({
        counter: prevState.adminIds.splice(index, 1),
      }));
    }
  }

  async function removeUserFromTeam(userId, projectIds) {
    // Kick them out of every project at once, and wait until it's all done
    await Promise.all(
      projectIds.map((projectId) =>
        api.delete(`projects/${projectId}/authorization`, {
          data: { targetUserId: userId },
        }),
      ),
    );
    // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
    await api.delete(`teams/${team.id}/users/${userId}`);
    removeUserAdmin(userId);
    mergeTeam(({ users }) => ({
      users: users.filter((u) => u.id !== userId),
    }));
    if (currentUser && currentUser.id === userId) {
      const teams = currentUser.teams.filter(({ id }) => id !== team.id);
      updateCurrentUser({ teams });
    }
  }

  async function updateUserPermissions(id, accessLevel) {
    if (accessLevel === MEMBER_ACCESS_LEVEL && team.adminIds.length <= 1) {
      createNotification('A team must have at least one admin', { type: 'error' });
      return false;
    }
    await api.patch(`teams/${team.id}/users/${id}`, {
      access_level: accessLevel,
    });
    if (accessLevel === ADMIN_ACCESS_LEVEL) {
      mergeTeam((prevState) => ({
        counter: prevState.adminIds.push(id),
      }));
    } else {
      removeUserAdmin(id);
    }
    return null;
  }

  async function addProject(project) {
    await api.post(`teams/${team.id}/projects/${project.id}`);
    mergeTeam(({ projects }) => ({
      projects: [project, ...projects],
    }));
  }

  async function removeProject(id) {
    await api.delete(`teams/${team.id}/projects/${id}`);
    mergeTeam(({ projects }) => ({
      projects: projects.filter((p) => p.id !== id),
    }));
  }

  async function deleteProject(id) {
    await api.delete(`/projects/${id}`);
    mergeTeam(({ projects }) => ({
      projects: projects.filter((p) => p.id !== id),
    }));
  }

  async function addPin(id) {
    await api.post(`teams/${team.id}/pinned-projects/${id}`);
    mergeTeam(({ teamPins }) => ({
      teamPins: [...teamPins, { projectId: id }],
    }));
  }

  async function removePin(id) {
    await api.delete(`teams/${team.id}/pinned-projects/${id}`);
    mergeTeam(({ teamPins }) => ({
      teamPins: teamPins.filter((p) => p.projectId !== id),
    }));
  }

  async function joinTeamProject(projectId) {
    await api.post(`/teams/${team.id}/projects/${projectId}/join`);
  }

  async function leaveTeamProject(projectId) {
    await api.delete(`/projects/${projectId}/authorization`, {
      data: {
        targetUserId: currentUser.id,
      },
    });
  }

  async function addProjectToCollection(project, collection) {
    await api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async function unfeatureProject() {
    await updateFields({ featured_project_id: null });
  }

  async function featureProject(id) {
    await updateFields({ featured_project_id: id });
  }

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    joinTeam: () => joinTeam().catch(handleError),
    inviteEmail: (email) => inviteEmail(email).catch(handleError),
    inviteUser: (id) => inviteUser(id).catch(handleError),
    removeUserFromTeam: (id, projectIds) => removeUserFromTeam(id, projectIds).catch(handleError),
    uploadAvatar: () => assets.requestFile((blob) => uploadAvatar(blob).catch(handleError)),
    uploadCover: () => assets.requestFile((blob) => uploadCover(blob).catch(handleError)),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: (project) => addProject(project).catch(handleError),
    removeProject: (id) => removeProject(id).catch(handleError),
    deleteProject: (id) => deleteProject(id).catch(handleError),
    addPin: (id) => addPin(id).catch(handleError),
    removePin: (id) => removePin(id).catch(handleError),
    updateWhitelistedDomain: (whitelistedDomain) => updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: (id, accessLevel) => updateUserPermissions(id, accessLevel).catch(handleError),
    joinTeamProject: (projectId) => joinTeamProject(projectId).catch(handleError),
    leaveTeamProject: (projectId) => leaveTeamProject(projectId).catch(handleError),
    addProjectToCollection: (project, collection) => addProjectToCollection(project, collection).catch(handleCustomError),
    featureProject: (id) => featureProject(id).catch(handleError),
    unfeatureProject: (id) => unfeatureProject(id).catch(handleError),
  };
  return [team, funcs];
}
