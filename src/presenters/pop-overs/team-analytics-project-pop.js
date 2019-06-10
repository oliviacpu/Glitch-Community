import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from 'Components/project/project-result-item';
import { PopoverWithButton, PopoverDialog, PopoverSearch } from 'Components/popover';

const AllProjectsItem = ({ currentProjectDomain, action }) => {
  const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';
  let resultsClass = 'button-unstyled result result-project';
  if (!currentProjectDomain) {
    resultsClass += ' active';
  }
  return (
    <button className={resultsClass} onClick={action} type="button">
      <img className="avatar" src={BENTO_BOX} alt="" />
      <div className="result-name" title="All Projects">
        All Projects
      </div>
    </button>
  );
};

AllProjectsItem.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

const isActive = (currentProjectDomain, project) => {
  if (currentProjectDomain === project.domain) {
    return true;
  }
  return false;
};

const ProjectSearch = ({ projects, togglePopover, setFilter, filter, updateProjectDomain, currentProjectDomain }) => {
  const onSubmit = (project) => {
    togglePopover();
    updateProjectDomain(project.domain);
    setFilter('');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(({ domain }) => domain.toLowerCase().includes(filter.toLowerCase()));
  }, [projects, filter]);

  return (
    <PopoverDialog align="left">
      <PopoverSearch
        value={filter}
        onChange={setFilter}
        status="ready"
        results={filteredProjects}
        onSubmit={onSubmit}
        label="Filter projects"
        placeholder="Filter projects"
        renderItems={({ item: project, active }) => (
          <ProjectResultItem 
            project={project} 
            onClick={() => onSubmit(project)}
            active={active || currentProjectDomain === project.domain}
          />
        )}
      >
        <AllProjectsItem currentProjectDomain={currentProjectDomain} action={() => onClick('')} />
      </PopoverSearch>
    </PopoverDialog>
  );
};

ProjectSearch.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  togglePopover: PropTypes.func, // required but added dynamically
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};


const Dropdown = () => <div className="down-arrow" aria-label="options" />;

const TeamAnalyticsProjectPop = ({ updateProjectDomain, currentProjectDomain }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small', type: 'tertiary' }}
    buttonText={currentProjectDomain ? <>Project: {currentProjectDomain} <Dropdown /></> : <>All Projects <Dropdown /></>}
  >
    {({ toggleAndCall }) => (
      <PopOver
        projects={projects}
        updateProjectDomain={toggleAndCall(updateProjectDomain)}
        currentProjectDomain={currentProjectDomain}
      />
    )}
  </PopoverWithButton>
);

TeamAnalyticsProjectPop.propTypes = {
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};

export default TeamAnalyticsProjectPop;
