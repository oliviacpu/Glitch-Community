import React from 'react';
import PropTypes from 'prop-types';

import { useCurrentUser } from './current-user';
import useErrorHandlers from './error-handlers';
import { useAPI } from '../state/api'
import { selectCurrentUser } from '../state/current-user'
import { useSelector } from '../state/context'

class CollectionEditor extends React.Component {
  constructor(props) {
  super(props);

    this.state = {
      ...props.initialCollection,
    };
  }

  userIsAuthor() {
    if (!this.props.currentUser) return false;
    if (this.state.teamId > 0) {
      return this.props.currentUser.teams.some((team) => team.id === this.state.teamId);
    }
    if (this.state.userId > 0) {
      return this.props.currentUser.id === this.state.userId;
    }
    return false;
  }

  async updateFields(changes) {
    const { data } = await this.props.api.patch(`collections/${this.state.id}`, changes);
    this.setState(data);
  }

  async addProjectToCollection(project, collection) {
    if (collection.id === this.state.id) {
      // add project to collection page
      this.setState(({ projects }) => ({
        projects: [project, ...projects],
      }));
    }
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async removeProjectFromCollection(project) {
    await this.props.api.patch(`collections/${this.state.id}/remove/${project.id}`);
    this.setState(({ projects }) => ({
      projects: projects.filter((p) => p.id !== project.id),
    }));
  }

  async deleteCollection() {
    await this.props.api.delete(`/collections/${this.state.id}`);
  }

  render() {
    const { handleError, handleErrorForInput, handleCustomError } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
      removeProjectFromCollection: (project) => this.removeProjectFromCollection(project).catch(handleError),
      deleteCollection: () => this.deleteCollection().catch(handleError),
      updateNameAndUrl: ({ name, url }) => this.updateFields({ name, url }).catch(handleErrorForInput),
      updateDescription: (description) => this.updateFields({ description }).catch(handleError),
      updateColor: (color) => this.updateFields({ coverColor: color }),
    };
    return this.props.children(this.state, funcs, this.userIsAuthor());
  }
}
CollectionEditor.propTypes = {
  api: PropTypes.any,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
};

CollectionEditor.defaultProps = {
  currentUser: null,
  api: null,
};

const CollectionEditorContainer = ({ children, initialCollection }) => {
  const currentUser = useSelector(selectCurrentUser);
  const api = useAPI();
  const errorFuncs = useErrorHandlers();
  return (
    <CollectionEditor {...{ api, currentUser, initialCollection }} {...errorFuncs}>
      {children}
    </CollectionEditor>
  );
};
CollectionEditorContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
};

export default CollectionEditorContainer;
