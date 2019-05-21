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
import Note from 'Components/collection/note';
import Grid from 'Components/containers/grid';
import Row from 'Components/containers/row';

import styles from './projects-list.styl';

const containers = {
  row: (props) => <Row className={styles.projectsRow} {...props} />,
  grid: (props) => <Grid className={styles.projectsGrid} {...props} />,
  gridCompact: (props) => <Grid className={styles.projectsGridCompact} {...props} />,
};

const ProjectsUL = ({ collection, projects, noteOptions, layout, projectOptions }) => {
  const Container = containers[layout];
  return (
    <Container items={projects}>
      {(project) => (
        <>
          {collection && (
            <div className={styles.projectsContainerNote}>
              <Note
                project={project}
                collection={collection}
                isAuthorized={noteOptions.isAuthorized}
                hideNote={noteOptions.hideNote}
                updateNote={noteOptions.updateNote}
              />
            </div>
          )}
          <ProjectItem key={project.id} project={project} projectOptions={projectOptions} />
        </>
      )}
    </Container>
  );
};

const arrowSrc = 'https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269';

const PaginationController = ({ enabled, projects, projectsPerPage, children }) => {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const canPaginate = enabled && !expanded && projectsPerPage < numProjects;

  if (canPaginate) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }
  return (
    <>
      {children(projects)}
      {canPaginate && (
        <div className={styles.viewControls}>
          <div data-cy="pagination-controls" className={styles.paginationControls}>
            <Button data-cy="previous-page" aria-label="Previous" type="tertiary" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <Image alt="" className={styles.paginationArrow} src={arrowSrc} />
            </Button>
            <div data-cy="page-numbers" className={styles.pageNumbers}>
              {page} / {numPages}
            </div>
            <Button data-cy="next-page" aria-label="Next" type="tertiary" disabled={page === numPages} onClick={() => setPage(page + 1)}>
              <Image alt="" className={classNames(styles.paginationArrow, styles.next)} src={arrowSrc} />
            </Button>
          </div>
          <Button data-cy="show-all" type="tertiary" onClick={() => setExpanded(true)}>
            Show all<Badge data-cy="total-projects">{numProjects}</Badge>
          </Button>
        </div>
      )}
    </>
  );
};

const FilterController = ({ enabled, placeholder, projects, children }) => {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterProjects() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredProjects(projects.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => filterProjects(), [projects]);
  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedProjects = filtering ? filteredProjects : projects;

  return children({
    filterInput: enabled && (
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
    ),
    renderProjects: (renderFn) => {
      if (displayedProjects.length) return renderFn(displayedProjects);

      if (filtering) {
        return (
          <div className={styles.filterResultsPlaceholder}>
            <Image alt="" src="https://cdn.glitch.com/c117d5df-3b8d-4389-9e6b-eb049bcefcd6%2Fcompass-not-found.svg?1554146070630" />
            <Text>No projects found</Text>
          </div>
        );
      }
      return placeholder;
    },
  });
};

function ProjectsList({
  projects,
  layout,
  title,
  placeholder,
  enableFiltering,
  enablePagination,
  projectsPerPage,
  collection,
  noteOptions,
  projectOptions,
  ...props
}) {
  return (
    <FilterController enabled={enableFiltering} placeholder={placeholder} projects={projects}>
      {({ filterInput, renderProjects }) => (
        <article className={classNames(styles.projectsContainer)}>
          <div className={styles.header}>
            {title && <Heading tagName="h2">{title}</Heading>}
            {filterInput}
          </div>
          {renderProjects((filteredProjects) => (
            <PaginationController enabled={enablePagination} projects={filteredProjects} projectsPerPage={projectsPerPage}>
              {(paginatedProjects) => (
                <ProjectsUL
                  projects={paginatedProjects}
                  collection={collection}
                  noteOptions={noteOptions}
                  layout={layout}
                  projectOptions={projectOptions}
                />
              )}
            </PaginationController>
          ))}
        </article>
      )}
    </FilterController>
  );
}

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['row', 'grid', 'gridCompact']).isRequired,
  title: PropTypes.node,
  placeholder: PropTypes.node,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
  projectsPerPage: PropTypes.number,
  collection: PropTypes.object,
  noteOptions: PropTypes.object,
  projectOptions: PropTypes.object,
};

ProjectsList.defaultProps = {
  title: null,
  placeholder: null,
  enableFiltering: false,
  enablePagination: false,
  projectsPerPage: 6,
  collection: null,
  noteOptions: {},
  projectOptions: {},
};

export default ProjectsList;
