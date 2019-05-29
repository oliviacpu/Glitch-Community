import React from 'react';
import PropTypes from 'prop-types';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import ProjectResultItem from '../includes/project-result-item';
import PopoverWithButton from './popover-with-button';

class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredProjects: [],
      filterPlaceholder: 'Filter my projects',
    };
    this.onClick = this.onClick.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.filterInput = React.createRef();
    this.filterProjects = this.filterProjects.bind(this);
  }

  componentDidMount() {
    this.filterInput.current.focus();
    // this.updateFilter('');
  }

  filterProjects(query, projects, teamProjects) {
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
  }

  render() {
    const { filteredProjects } = this.state;

    function filterInputIsBlank() {
      return this.filterInput.current.value.length === 0;
    }

    function updateFilter(query) {
      const projects = this.props.myProjects;
      const filteredProjects = this.filterProjects(query, projects, this.props.teamProjects);
      this.setState({
        filteredProjects,
      });
    }
    
    function onClick(event, project) {
      event.preventDefault();
      this.props.togglePopover();
      this.props.addProject(project);
    }

    return (
      <dialog className="pop-over add-team-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            ref={this.filterInput}
            onChange={(event) => {
              updateFilter(event.target.value);
            }}
            id="team-project-search"
            className="pop-over-input search-input pop-over-search"
            placeholder={this.state.filterPlaceholder}
            aria-label={this.state.filterPlaceholder}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>

        <section className="pop-over-actions results-list">
          <ul className="results">
            {filteredProjects.map((project) => (
              <li key={project.id}>
                <ProjectResultItem
                  onClick={(event) => this.onClick(event, project)}
                  {...project}
                  title={project.domain}
                  isPrivate={project.private}
                />
              </li>
            ))}
          </ul>
          {this.state.filteredProjects.length === 0 && filterInputIsBlank() && (
            <p className="action-description no-projects-description">Create or Join projects to add them to the team</p>
          )}
        </section>
      </dialog>
    );
  }
}

AddTeamProjectPop.propTypes = {
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  addProject: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
};

const AddTeamProject = ({ addProject, teamProjects }) => {
  const api = useAPI();
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
            api={api}
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
