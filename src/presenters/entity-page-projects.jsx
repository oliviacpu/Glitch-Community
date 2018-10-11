import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';
import ProjectsLoader from './projects-loader.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const EntityPageProjects = ({api, projects, pins, currentUser, isAuthorized, addPin, removePin, projectOptions, reloadProject}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const [pinnedProjects, recentProjects] = _.partition(projects, ({id}) => pinnedSet.has(id));
  
  const pinnedVisible = (isAuthorized || pinnedProjects.length) && projects.length;
  
  const pinnedTitle = (
    <React.Fragment>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </React.Fragment>
  );
  
  const pinnedEmpty = (
    <React.Fragment>
      <img className="psst" src={psst} alt="psst"></img>
      <p>
        Pin your projects to show them off
        <span className="emoji pushpin"></span>
      </p>
    </React.Fragment>
  );
  
  projectOptions = _.mapValues(projectOptions, function(projectOption) {
    return async (projectId, userId) => {
      await projectOption(projectId, userId);
      reloadProject(projectId);
    };
  });

  return (
    <React.Fragment>
      {!!pinnedVisible && (
        <ProjectsList title={pinnedTitle}
          projects={pinnedProjects} placeholder={pinnedEmpty}
          api={api}
          addProjectTocollection={projectOptions.addProjectToCollection}
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
              : (currentUser ? {...projectOptions} : {})
          }
        />
      )}
      {!!recentProjects.length && (
        <ProjectsList title="Recent Projects" projects={recentProjects}
          api={api}
          addProjectTocollection={projectOptions.addProjectToCollection}
          projectOptions={isAuthorized ? {addPin, ...projectOptions} 
                          : (currentUser ? {...projectOptions} : {})
          }
        />
      )}
    </React.Fragment>
  );
};
EntityPageProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  pins: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  addPin: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPageProjectsContainer = ({api, projects, ...props}) => (
  <CurrentUserConsumer>
    {currentUser => (
      <ProjectsLoader api={api} projects={projects}>
        {(projects, reloadProject) => <EntityPageProjects api={api} projects={projects} reloadProject={reloadProject} currentUser={currentUser} {...props}/>}
      </ProjectsLoader>
    )}
  </CurrentUserConsumer>
);

export default EntityPageProjectsContainer;  