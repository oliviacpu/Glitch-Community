import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import ProjectResultItem from '../includes/project-result-item';
import PopoverWithButton from './popover-with-button';

const filterProjects = (query, projects, teamProjects) => {
  query = query.toLowerCase().trim();
  const MAX_PROJECTS = 20;
  const teamProjectIds = teamProjects.map(({ id }) => id);
  const availableProjects = projects.filter(({ id }) => !teamProjectIds.includes(id));
  const filteredProjects = [];
  if (!query) {
    return availableProjects.splice(0, MAX_PROJECTS);
  }
  for (const project of availableProjects) {
    // eslint-disable-line
    if (filteredProjects.length > MAX_PROJECTS) {
      break;
    }
    const titleMatch = project.domain.toLowerCase().includes(query);
    const descMatch = project.description.toLowerCase().includes(query);
    if (titleMatch || descMatch) {
      filteredProjects.push(project);
    }
  }
  return filteredProjects;
};

function AddTeamProjectPop({ myProjects, teamProjects, togglePopover, addProject }) {
  const [filteredProjects, setFilteredProjects] = useState(filterProjects('', myProjects, teamProjects));
  const filterInput = useRef();
  useEffect(() => {
    filterInput.current.focus();
  }, []);

  const filterInputIsBlank = filterInput.current.value.length === 0;

  const updateFilter = (query) => {
    const filteredProjects = filterProjects(query, myProjects, teamProjects);
    setFilteredProjects(filteredProjects);
  };

  const onClick = (event, project) => {
    event.preventDefault();
    togglePopover();
    addProject(project);
  };
  
  const filterPlaceholder = 'Filter my projects';

  return (
    <dialog className="pop-over add-team-project-pop wide-pop">
      <section className="pop-over-info">
        <input
          ref={filterInput}
          onChange={(event) => {
            updateFilter(event.target.value);
          }}
          id="team-project-search"
          className="pop-over-input search-input pop-over-search"
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        />
      </section>

      <section className="pop-over-actions results-list">
        <ul className="results">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <ProjectResultItem onClick={(event) => onClick(event, project)} {...project} title={project.domain} isPrivate={project.private} />
            </li>
          ))}
        </ul>
        {filteredProjects.length === 0 && filterInputIsBlank && (
          <p className="action-description no-projects-description">Create or Join projects to add them to the team</p>
        )}
      </section>
    </dialog>
  );
}

AddTeamProjectPop.propTypes = {
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  addProject: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

const AddTeamProject = ({ addProject, teamProjects }) => {
  const { currentUser } = useCurrentUser();
  return (
    <section className="add-project-container">
      {/* Add disabled={props.projectLimitIsReached} once billing is ready */}
      <PopoverWithButton
        buttonClass="add-project has-emoji"
        buttonText={
          <>
            Add Project <span className="emoji bento-box" role="presentation" />
          </>
        }
      >
        {({ togglePopover }) => (
          <AddTeamProjectPop
            myProjects={currentUser.projects}
            addProject={addProject}
            teamProjects={teamProjects}
            togglePopover={togglePopover}
          />
        )}
      </PopoverWithButton>
    </section>
  );
};
AddTeamProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
};

export default AddTeamProject;
