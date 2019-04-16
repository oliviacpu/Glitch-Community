import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames/bind';

import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import ProjectItem from 'Components/project/project-item';

import styles from './projects-list.styl';

const cx = classNames.bind(styles);

function ProjectsList({ title, placeholder, extraClasses, enableFiltering, enablePagination, ...props }) {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  let { projects } = props;

  function filterProjects() {
    setIsDoneFiltering(false);

    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredProjects(props.projects.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  projects = filtering ? filteredProjects : projects;

  let projectsEl;
  if (enablePagination) {
    projectsEl = <PaginatedProjects {...props} projects={projects} />;
  } else {
    projectsEl = <ProjectsUL {...props} projects={projects} />;
  }

  const placeholderEl = filtering ? (
    <div className={styles.filterResultsPlaceholder}>
      <Image alt="" src="https://cdn.glitch.com/c117d5df-3b8d-4389-9e6b-eb049bcefcd6%2Fcompass-not-found.svg?1554146070630" />
      <Text>No projects found</Text>
    </div>
  ) : (
    props.placeholder
  );

  return (
    <article className={`projects ${extraClasses}`}>
      <div className={styles.header}>
        <Heading tagName="h2">{title}</Heading>
        {enableFiltering ? (
          <TextInput
            className={styles.headerSearch}
            name="filter"
            onChange={setFilter}
            opaque
            placeholder="find a project"
            labelText="project search"
            type="search"
            value={filter}
          />
        ) : null}
      </div>

      {projects.length ? projectsEl : placeholderEl}
    </article>
  );
}

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  extraClasses: PropTypes.string,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
};

ProjectsList.defaultProps = {
  placeholder: null,
  extraClasses: '',
  enableFiltering: false,
  enablePagination: false,
};

function PaginatedProjects(props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  let { projects, projectsPerPage } = props; // eslint-disable-line prefer-const

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const canPaginate = !expanded && projectsPerPage < numProjects;

  if (!expanded && canPaginate) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  const PaginationControls = () => (
    <div className={styles.paginationControls}>
      <Button aria-label="Previous" type="tertiary" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <Image
          alt=""
          className={styles.paginationArrow}
          src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269"
        />
      </Button>
      <div className={styles.pageNumbers}>
        {page} / {numPages}
      </div>
      <Button aria-label="Next" type="tertiary" disabled={page === numPages} onClick={() => setPage(page + 1)}>
        <Image
          alt=""
          className={cx({ paginationArrow: true, next: true })}
          src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269"
        />
      </Button>
    </div>
  );

  return (
    <>
      <ProjectsUL {...props} projects={projects} />

      {canPaginate ? (
        <div className={styles.viewControls}>
          <PaginationControls />
          <Button type="tertiary" onClick={() => setExpanded(true)}>
            Show all<Badge>{numProjects}</Badge>
          </Button>
        </div>
      ) : null}
    </>
  );
}

PaginatedProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  projectsPerPage: PropTypes.number,
};

PaginatedProjects.defaultProps = {
  projectsPerPage: 6,
};

export const ProjectsUL = ({ showProjectDescriptions, ...props }) => (
  <ul className="projects-container">
    {props.projects.map((project) => (
      <li key={project.id}>
        <ProjectItem key={project.id} project={project} showProjectDescriptions={showProjectDescriptions} {...props} />
      </li>
    ))}
  </ul>
);

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  showProjectDescriptions: PropTypes.bool,
};

ProjectsUL.defaultProps = {
  showProjectDescriptions: true,
};

export default ProjectsList;
