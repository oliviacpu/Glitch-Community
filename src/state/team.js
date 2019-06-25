import { useState } from 'react';

import * as assets from 'Utils/assets';

import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import useUploader from 'State/uploader';
import useErrorHandlers from 'State/error-handlers';
import { useProjectReload } from 'State/project';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

export function useTeamEditor(initialTeam) {
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const 
  const reloadProjectMembers = useProjectReload();
  const { updateItem, joinTeam, inviteEmailToTeam, inviteUserToTeam, removeUserFromProject, removeUserFromTeam } = useAPIHandlers();
  const [team, setTeam] = useState({
    ...initialTeam,
    _cacheAvatar: Date.now(),
    _cacheCover: Date.now(),
  });

  async function updateFields(changes) {
    const { data } = await updateItem({ team }, changes);
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

  function updatePermissions(projectId, permissions) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          permissions,
        };
      }),
    }));
  }

  function removePermissions(user, projects) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (!projects.some((project) => project.id === p.id)) return p;
        return {
          ...p,
          permissions: p.permissions.filter((perm) => perm.userId !== user.id),
        };
      }),
    }));
  }

  function removeUserAdmin(user) {
    const index = team.adminIds.indexOf(user.id);
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
      await joinTeam({ team });
      setTeam((prev) => ({
        ...prev,
        users: [...prev.users, currentUser],
      }));
      if (currentUser) {
        const { teams } = currentUser;
        updateCurrentUser({ teams: [...teams, team] });
      }
    }, handleError),
    inviteEmail: (email) => inviteEmailToTeam({ team }, email).catch(handleError),
    inviteUser: (user) => inviteUserToTeam({ user, team }).catch(handleError),
    removeUserFromTeam: withErrorHandler(async (user, projects) => {
      // Kick them out of every project at once, and wait until it's all done
      await Promise.all(projects.map((project) => removeUserFromProject({ project, user })));
      // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
      await removeUserFromTeam({ user, team });
      removeUserAdmin(user);
      setTeam((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== user.id),
      }));
      if (currentUser && currentUser.id === user.id) {
        const teams = currentUser.teams.filter(({ id }) => id !== team.id);
        updateCurrentUser({ teams });
      }
      // update projects so that this user no longer appears in member lists
      reloadProjectMembers(projects.map((project) => project.id));
      removePermissions(user, projects);
    }, handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await assets.getTeamAvatarImagePolicy(api, team.id);
          await uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasAvatarImage: true,
            backgroundColor: color,
          });
          setTeam((prev) => ({ ...prev, _cacheAvatar: Date.now() }));
        }, handleError),
      ),
    uploadCover: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await assets.getTeamCoverImagePolicy(api, team.id);
          await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasCoverImage: true,
            coverColor: color,
          });
          setTeam((prev) => ({ ...prev, _cacheCover: Date.now() }));
        }, handleError),
      ),
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
    joinTeamProject: withErrorHandler(async (projectId) => {
      const { data: updatedProject } = await addUserToProject(api, projectId, team);
      updatePermissions(projectId, updatedProject.users.map((user) => user.projectPermission));
      reloadProjectMembers([projectId]);
    }, handleError),
    leaveTeamProject: withErrorHandler(async (project) => {
      await removeUserFromProject(api, projectId, currentUser.id);
      removePermissions(currentUser, [project]);
      reloadProjectMembers([projectId]);
    }, handleError),
    addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection).catch(handleCustomError),
    featureProject: (id) => updateFields({ featured_project_id: id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [team, funcs];
}
