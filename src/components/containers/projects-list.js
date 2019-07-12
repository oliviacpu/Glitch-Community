import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import PaginationController from 'Components/pagination-controller';
import ProjectItem from 'Components/project/project-item';
import Note from 'Components/collection/note';
import Grid from 'Components/containers/grid';
import Row from 'Components/containers/row';
import classNames from 'classnames/bind';

import styles from './projects-list.styl';

const containers = {
  row: (props) => <Row className={styles.projectsRow} {...props} />,
  grid: (props) => <Grid className={styles.projectsGrid} {...props} />,
  gridCompact: (props) => <Grid className={styles.projectsGridCompact} {...props} />,
};

const ProjectsUL = ({ collection, projects, sortable, onReorder, noteOptions, layout, projectOptions }) => {
  const Container = containers[layout];
  return (
    <Container itemClassName={styles.projectsItem} items={projects} sortable={sortable} onReorder={onReorder}>
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
        data-cy="projects-filter"
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
  enableSorting,
  onReorder,
  projectsPerPage,
  collection,
  noteOptions,
  projectOptions,
  dataCy,
}) {
  return (
    <FilterController enabled={enableFiltering} placeholder={placeholder} projects={projects}>
      {({ filterInput, renderProjects }) => (
        <article className={classNames(styles.projectsContainer)} data-cy={dataCy}>
          <div className={styles.header}>
            {title && <Heading tagName="h2">{title}</Heading>}
            {filterInput}
          </div>
          {renderProjects((filteredProjects) => (
            <PaginationController enabled={enablePagination} items={filteredProjects} itemsPerPage={projectsPerPage}>
              {(paginatedProjects) => (
                <ProjectsUL
                  projects={paginatedProjects}
                  collection={collection}
                  noteOptions={noteOptions}
                  layout={layout}
                  sortable={enableSorting && paginatedProjects.length === projects.length}
                  onReorder={onReorder}
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
  enableSorting: (props) => props.enableSorting && props.layout === 'row' && new Error('Sortable rows are not supported'),
  projectsPerPage: PropTypes.number,
  collection: PropTypes.object,
  noteOptions: PropTypes.object,
  projectOptions: PropTypes.object,
  dataCy: PropTypes.string,
};

ProjectsList.defaultProps = {
  title: null,
  placeholder: null,
  enableFiltering: false,
  enablePagination: false,
  enableSorting: false,
  projectsPerPage: 6,
  collection: null,
  noteOptions: {},
  projectOptions: {},
  dataCy: null,
};

export default ProjectsList;
