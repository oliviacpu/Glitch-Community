import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';
import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';
import useErrorHandlers from './error-handlers';
import useUploader from './includes/uploader';

class ProjectEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialProject,
      _avatarCache: Date.now(),
    };
  }

  userIsMember() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.users.some(({ id }) => currentUserId === id);
  }

  async updateFields(changes) {
    console.log("Testing??")
    throw new Error("fake")
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }

  async updateDomain(domain) {
    await this.updateFields({ domain });
    // don't await this because the project domain has already changed and I don't want to delay other things updating
    this.props.api.post(`project/domainChanged?projectId=${this.state.id}&authorization=${this.props.currentUser.persistentToken}`, {}, {
      transformRequest: (data, headers) => {
        // this endpoint doesn't like OPTIONS requests, which axios sends if there is an auth header (case 3328590)
        delete headers.Authorization;
        return data;
      },
    });
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async deleteProject() {
    await this.props.api.delete(`projects/${this.state.id}`);
  }

  async uploadAvatar(blob) {
    const { data: policy } = await assets.getProjectAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAsset(blob, policy, '', { cacheControl: 60 });
    this.setState({ _avatarCache: Date.now() });
  }

  render() {
    const { handleError, handleErrorForInput, handleCustomError } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
      deleteProject: () => this.deleteProject().catch(handleError),
      updateDomain: (domain) => this.updateDomain(domain).catch(handleErrorForInput),
      updateDescription: (description) => this.updateFields({ description }).catch(handleErrorForInput),
      updatePrivate: (isPrivate) => this.updateFields({ private: isPrivate }).catch(handleError),
      uploadAvatar: () => assets.requestFile((blob) => this.uploadAvatar(blob).catch(handleError)),
    };
    return this.props.children(this.state, funcs, this.userIsMember());
  }
}

ProjectEditor.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialProject: PropTypes.object.isRequired,
};

ProjectEditor.defaultProps = {
  currentUser: null,
};

const ProjectEditorContainer = ({ children, initialProject }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const errorFuncs = useErrorHandlers();
  const uploadFuncs = useUploader();
  return (
    <ProjectEditor api={api} currentUser={currentUser} initialProject={initialProject} {...errorFuncs} {...uploadFuncs}>
      {children}
    </ProjectEditor>
  );
};

ProjectEditorContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initialProject: PropTypes.object.isRequired,
};

export default ProjectEditorContainer;
