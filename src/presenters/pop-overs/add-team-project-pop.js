import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useCurrentUser } from 'State/current-user';
import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverInfo, ActionDescription } from 'components/popover'

import ProjectResultItem from '../includes/project-result-item';

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

function AddTeamProjectPop({ teamProjects, togglePopover, addProject }) {
  const [query, setQuery] = useState('');
  const { currentUser } = useCurrentUser();
  const myProjects = currentUser.projects;

  const filteredProjects = useMemo(() => filterProjects(query, myProjects, teamProjects), [query, myProjects, teamProjects]);

  const onClick = (event, project) => {
    event.preventDefault();
    togglePopover();
    addProject(project);
  };

  const filterPlaceholder = 'Filter my projects';

  return (
    <PopoverDialog wide align="left">
      <section className="pop-over-info">
        <input
          onChange={(event) => {
            setQuery(event.target.value);
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
        
      </section>
      {filteredProjects.length === 0 && query.length === 0 && (
        <PopoverActions>
          <ActionDescription>Create or Join projects to add them to the team</ActionDescription>
        </PopoverActions>
      )}
    </PopoverDialog>
  );
}

const AddTeamProject = ({ addProject, teamProjects }) => (
  <PopoverWithButton
    buttonText={
      <>
        Add Project <span className="emoji bento-box" role="presentation" />
      </>
    }
  >
    {({ togglePopover }) => <AddTeamProjectPop addProject={addProject} teamProjects={teamProjects} togglePopover={togglePopover} />}
  </PopoverWithButton>
);
AddTeamProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
};

export default AddTeamProject;
