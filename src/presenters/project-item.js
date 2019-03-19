import React from 'react';
import PropTypes from 'prop-types';

import { getAvatarUrl } from '../models/project';

import { ProjectLink } from './includes/link';
import Markdown from '../components/text/markdown';
import ProjectOptionsPop from './pop-overs/project-options-pop';
import UsersList from './users-list';

const ProjectItem = ({ api, project, ...props }) => (
  <li>
    <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line" teams={project.teams} />
    <ProjectOptionsPop {...{ project, api }} {...props} />
    <ProjectLink project={project} className="button-area">
      <div className={['project', project.private ? 'private-project' : ''].join(' ')} data-track="project" data-track-label={project.domain}>
        <div className="project-container">
          <img className="avatar" src={getAvatarUrl(project.id)} alt="" />
          <div className="button">
            <span className="project-badge private-project-badge" aria-label="private" />
            <div className="project-name">{project.domain}</div>
          </div>
          <div className="description">
            <Markdown length={80}>{project.description}</Markdown>
          </div>
          <div className="overflow-mask" />
        </div>
      </div>
    </ProjectLink>
  </li>
);

ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  projectOptions: {},
};

export default ProjectItem;
