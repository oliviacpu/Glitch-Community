import React from 'react';
import PropTypes from 'prop-types';

import ProfileList from 'Components/profile-list';
import Markdown from 'Components/text/markdown';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from 'Components/link';

const ProjectResultItem = ({ onClick, isActive, isPrivate, ...project }) => {
  const activeClass = isActive ? 'active' : '';
  const privateClass = isPrivate ? 'private' : '';
  const resultClass = `button-unstyled result result-project ${activeClass} ${privateClass}`;
  const { id, domain, description, users } = project;

  return (
    <div>
      <button className={resultClass} onClick={onClick} data-project-id={id} type="button">
        <ProjectAvatar project={project} />
        <div className="results-info">
          <div className="result-name" title={domain}>
            {domain}
          </div>
          {description.length > 0 && (
            <div className="result-description">
              <Markdown renderAsPlaintext>{description}</Markdown>
            </div>
          )}
          {!!users && users.length > 0 && <ProfileList users={users} layout="row" />}
        </div>
      </button>
      <ProjectLink project={project} className="view-result-link button button-small button-link" target="_blank" rel="noopener noreferrer">
        View →
      </ProjectLink>
    </div>
  );
};

ProjectResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: PropTypes.array,
  isActive: PropTypes.bool,
  isPrivate: PropTypes.bool,
};

ProjectResultItem.defaultProps = {
  users: [],
  isActive: false,
  isPrivate: false,
};

export default ProjectResultItem;
