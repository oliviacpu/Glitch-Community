import React, { useState } from 'react';
import PropTypes from 'prop-types';

import * as assets from 'Utils/assets';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import useErrorHandlers from './error-handlers';
import useUploader from './includes/uploader';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

function TeamEditor (props) {
  const [state, setState] = useState({
    ...props.initialTeam,
    _cacheAvatar: Date.now(),
    _cacheCover: Date.now(),
  })
  
  async function updateFields(changes) {
    const { data } = await this.props.api.patch(`teams/${this.state.id}`, changes);
    this.setState(data);
    if (this.props.currentUser) {
      const teamIndex = this.props.currentUser.teams.findIndex(({ id }) => id === this.state.id);
      if (teamIndex >= 0) {
        const teams = [...this.props.currentUser.teams];
        teams[teamIndex] = this.state;
        this.props.updateCurrentUser({ teams });
      }
    }
  }

  async function uploadAvatar(blob) {
    const { data: policy } = await assets.getTeamAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
    this.setState({ _cacheAvatar: Date.now() });
  }

  async function uploadCover(blob) {
    const { data: policy } = await assets.getTeamCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    this.setState({ _cacheCover: Date.now() });
  }

  async function joinTeam() {
    await this.props.api.post(`teams/${this.state.id}/join`);
    this.setState(({ users }) => ({
      users: [...users, this.props.currentUser],
    }));
    if (this.props.currentUser) {
      const { teams } = this.props.currentUser;
      this.props.updateCurrentUser({ teams: [...teams, this.state] });
    }
  }

  async function inviteEmail(emailAddress) {
    console.log('💣 inviteEmail', emailAddress);
    await this.props.api.post(`teams/${this.state.id}/sendJoinTeamEmail`, {
      emailAddress,
    });
  }

  async function inviteUser(user) {
    console.log('💣 inviteUser', user);
    await this.props.api.post(`teams/${this.state.id}/sendJoinTeamEmail`, {
      userId: user.id,
    });
  }

  async function removeUserFromTeam(userId, projectIds) {
    // Kick them out of every project at once, and wait until it's all done
    await Promise.all(
      projectIds.map((projectId) =>
        this.props.api.delete(`projects/${projectId}/authorization`, {
          data: { targetUserId: userId },
        }),
      ),
    );
    // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
    await this.props.api.delete(`teams/${this.state.id}/users/${userId}`);
    this.removeUserAdmin(userId);
    this.setState(({ users }) => ({
      users: users.filter((u) => u.id !== userId),
    }));
    if (this.props.currentUser && this.props.currentUser.id === userId) {
      const teams = this.props.currentUser.teams.filter(({ id }) => id !== this.state.id);
      this.props.updateCurrentUser({ teams });
    }
  }

  function removeUserAdmin(id) {
    const index = this.state.adminIds.indexOf(id);
    if (index !== -1) {
      this.setState((prevState) => ({
        counter: prevState.adminIds.splice(index, 1),
      }));
    }
  }

  async function updateUserPermissions(id, accessLevel) {
    if (accessLevel === MEMBER_ACCESS_LEVEL && this.state.adminIds.length <= 1) {
      this.props.createNotification('A team must have at least one admin', { type: 'error' });
      return false;
    }
    await this.props.api.patch(`teams/${this.state.id}/users/${id}`, {
      access_level: accessLevel,
    });
    if (accessLevel === ADMIN_ACCESS_LEVEL) {
      this.setState((prevState) => ({
        counter: prevState.adminIds.push(id),
      }));
    } else {
      this.removeUserAdmin(id);
    }
    return null;
  }

  async function addProject(project) {
    await this.props.api.post(`teams/${this.state.id}/projects/${project.id}`);
    this.setState(({ projects }) => ({
      projects: [project, ...projects],
    }));
  }

  async function removeProject(id) {
    await this.props.api.delete(`teams/${this.state.id}/projects/${id}`);
    this.setState(({ projects }) => ({
      projects: projects.filter((p) => p.id !== id),
    }));
  }

  async function deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    this.setState(({ projects }) => ({
      projects: projects.filter((p) => p.id !== id),
    }));
  }

  async function addPin(id) {
    await this.props.api.post(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({ teamPins }) => ({
      teamPins: [...teamPins, { projectId: id }],
    }));
  }

  async function removePin(id) {
    await this.props.api.delete(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({ teamPins }) => ({
      teamPins: teamPins.filter((p) => p.projectId !== id),
    }));
  }

  async function joinTeamProject(projectId) {
    await this.props.api.post(`/teams/${this.state.id}/projects/${projectId}/join`);
  }

  async function leaveTeamProject(projectId) {
    await this.props.api.delete(`/projects/${projectId}/authorization`, {
      data: {
        targetUserId: this.props.currentUser.id,
      },
    });
  }

  async function addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async function unfeatureProject() {
    await this.updateFields({ featured_project_id: null });
  }

  async function featureProject(id) {
    await this.updateFields({ featured_project_id: id });
  }

  const { handleError, handleErrorForInput, handleCustomError } = this.props;
  const funcs = {
    updateName: (name) => this.updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => this.updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => this.updateFields({ description }).catch(handleErrorForInput),
    joinTeam: () => this.joinTeam().catch(handleError),
    inviteEmail: (email) => this.inviteEmail(email).catch(handleError),
    inviteUser: (id) => this.inviteUser(id).catch(handleError),
    removeUserFromTeam: (id, projectIds) => this.removeUserFromTeam(id, projectIds).catch(handleError),
    uploadAvatar: () => assets.requestFile((blob) => this.uploadAvatar(blob).catch(handleError)),
    uploadCover: () => assets.requestFile((blob) => this.uploadCover(blob).catch(handleError)),
    clearCover: () => this.updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: (project) => this.addProject(project).catch(handleError),
    removeProject: (id) => this.removeProject(id).catch(handleError),
    deleteProject: (id) => this.deleteProject(id).catch(handleError),
    addPin: (id) => this.addPin(id).catch(handleError),
    removePin: (id) => this.removePin(id).catch(handleError),
    updateWhitelistedDomain: (whitelistedDomain) => this.updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: (id, accessLevel) => this.updateUserPermissions(id, accessLevel).catch(handleError),
    joinTeamProject: (projectId) => this.joinTeamProject(projectId).catch(handleError),
    leaveTeamProject: (projectId) => this.leaveTeamProject(projectId).catch(handleError),
    addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
    featureProject: (id) => this.featureProject(id).catch(handleError),
    unfeatureProject: (id) => this.unfeatureProject(id).catch(handleError),
  };
  return this.props.children(this.state, funcs);
}
TeamEditor.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  updateCurrentUser: PropTypes.func.isRequired,
  initialTeam: PropTypes.object.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

TeamEditor.defaultProps = {
  currentUser: null,
};

const TeamEditorContainer = ({ children, initialTeam }) => {
  const api = useAPI();
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const uploadFuncs = useUploader();
  const { createNotification } = useNotifications();
  const errorFuncs = useErrorHandlers();
  return (
    <TeamEditor
      {...{ api, currentUser, initialTeam }}
      updateCurrentUser={updateCurrentUser}
      {...uploadFuncs}
      createNotification={createNotification}
      {...errorFuncs}
    >
      {children}
    </TeamEditor>
  );
};
TeamEditorContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initialTeam: PropTypes.object.isRequired,
};

export default TeamEditorContainer;
