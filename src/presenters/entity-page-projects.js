import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from 'Components/containers/projects-list';

const EntityPageProjects = ({ projects, currentUser, isAuthorized, addPin, removePin, featureProject, projectOptions, ...props }) => {
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title" />
    </>
  );
  const recentTitle = 'Recent Projects';

  let projectOptionsToPass = {};
  if (isAuthorized) {
    projectOptionsToPass = { addPin, removePin, featureProject, ...projectOptions };
  } else if (currentUser && currentUser.login) {
    projectOptionsToPass = { ...projectOptions };
  }
  return (
    <>
      {projects.length > 0 && (
        <ProjectsList
          {...props}
          title={removePin ? pinnedTitle : recentTitle}
          projects={projects}
          projectOptions={projectOptionsToPass}
        />
      )}
    </>
  );
};
EntityPageProjects.propTypes = {
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  projectOptions: PropTypes.object,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
};

EntityPageProjects.defaultProps = {
  addPin: null,
  removePin: null,
  projectOptions: {},
  currentUser: null,
  enableFiltering: false,
  enablePagination: false,
};

export default EntityPageProjects;
