import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';
import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';
import useErrorHandlers from './error-handlers';

class ProjectEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialProject,
    };
  }

  userIsMember() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.users.some(({ id }) => currentUserId === id);
  }

  async updateFields(changes) {
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async uploadAvatar(blob) {
    const { data: policy } = await assets.getTeamAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
  }

  render() {
    const { handleError, handleErrorForInput, handleCustomError } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
      updateDomain: (domain) => this.updateFields({ domain }).catch(handleErrorForInput),
      updateDescription: (description) => this.updateFields({ description }).catch(handleError),
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
  return (
    <ProjectEditor api={api} currentUser={currentUser} initialProject={initialProject} {...errorFuncs}>
      {children}
    </ProjectEditor>
  );
};

ProjectEditorContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initialProject: PropTypes.object.isRequired,
};

export default ProjectEditorContainer;
