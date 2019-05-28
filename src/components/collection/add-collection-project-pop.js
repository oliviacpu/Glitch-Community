import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { partition, uniqBy } from 'lodash';

import { getAllPages } from 'Shared/api';
import Loader from 'Components/loader';
import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverInfo, InfoDescription } from 'Components/popover';
import TextInput from 'Components/inputs/text-input';
import ResultsList from 'Components/containers/results-list';
import Emoji from 'Components/images/emoji';
import ProjectResultItem from 'Components/project/project-result-item';
import { useTrackedFunc } from 'State/segment-analytics';
import { createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useAlgoliaSearch } from 'State/search';

import { useNotifications, AddProjectToCollectionMsg } from '../../presenters/notifications';

function parseQuery(query) {
  query = query.trim();
  try {
    const queryUrl = new URL(query);
    if (queryUrl.href.includes('me') && !queryUrl.href.includes('~')) {
      // https://add-to-alexa.glitch.me/
      return queryUrl.hostname.substring(0, queryUrl.hostname.indexOf('.'));
    }
    // https://glitch.com/~add-to-alexa
    return queryUrl.pathname.substring(queryUrl.pathname.indexOf('~') + 1);
  } catch (e) {
    return query;
  }
}

const useTeamProjects = createAPIHook(async (api, teamId) => {
  if (teamId > 0) {
    const projects = await getAllPages(api, `/v1/teams/by/id/projects?limit=100&orderKey=updatedAt&orderDirection=ASC&id=${teamId}`);
    return projects;
  }
  return null;
});

function useActiveIndex(items, onSelect) {
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);
  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev < 0) {
          return items.length - 1;
        }
        return prev - 1;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === items.length - 1) {
          return -1;
        }
        return prev + 1;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[activeIndex]) {
        onSelect(items[activeIndex]);
      }
    }
  };
  return { activeIndex, onKeyDown };
}

function AddCollectionProjectPop({ collection, togglePopover, addProjectToCollection }) {
  const [query, setQuery] = useState('');
  const parsedQuery = parseQuery(query);
  const { topResults, project: retrievedProjects, status } = useAlgoliaSearch(
    parsedQuery,
    {
      notSafeForKids: false,
      filterTypes: ['project'],
    },
    [],
  );

  const { value: teamProjects } = useTeamProjects(collection.teamId);
  const { currentUser } = useCurrentUser();
  const initialProjects = teamProjects || currentUser.projects;

  const { createNotification } = useNotifications();

  const onClick = useTrackedFunc(
    async (project) => {
      togglePopover();
      // add project to page if successful & show notification
      await addProjectToCollection(project, collection);
      createNotification(<AddProjectToCollectionMsg projectDomain={project.domain} />, 'notifySuccess');
    },
    'Project Added to Collection',
    { origin: 'Add Project collection' },
  );

  /* eslint-disable no-shadow */
  const { visibleProjects, excludingExactMatch } = useMemo(() => {
    const projects = parsedQuery.length ? uniqBy(topResults.concat(retrievedProjects), (p) => p.id) : initialProjects;

    const idsOfProjectsInCollection = new Set(collection.projects.map((p) => p.id));
    const [projectsAlreadyInCollection, newProjectsToAdd] = partition(projects, (project) => idsOfProjectsInCollection.has(project.id));

    const visibleProjects = newProjectsToAdd.slice(0, 10);
    const excludingExactMatch = projectsAlreadyInCollection.some((p) => p.domain === parsedQuery);
    return { visibleProjects, excludingExactMatch };
  }, [parsedQuery, initialProjects, topResults, retrievedProjects]);

  const { activeIndex, onKeyDown } = useActiveIndex(visibleProjects, onClick);

  return (
    <PopoverDialog wide align="left">
      <PopoverInfo>
        <TextInput
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          labelText="Project name or URL"
          value={query}
          onChange={setQuery}
          onKeyDown={onKeyDown}
          opaque
          placeholder="Search by project name or URL"
          type="search"
        />
      </PopoverInfo>

      {status === 'loading' && (
        <PopoverInfo>
          <Loader />
        </PopoverInfo>
      )}
      {status === 'ready' && excludingExactMatch && (
        <PopoverInfo>
          <InfoDescription>
            {parsedQuery} is already in this collection <Emoji name="sparkles" />
          </InfoDescription>
        </PopoverInfo>
      )}
      {visibleProjects.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={visibleProjects}>
            {(project, i) => <ProjectResultItem project={project} active={i === activeIndex} onClick={() => onClick(project)} />}
          </ResultsList>
        </PopoverSection>
      )}
      {status === 'ready' && visibleProjects.length === 0 && !excludingExactMatch && (
        <PopoverInfo>
          <InfoDescription>
            nothing found <Emoji name="sparkles" />
          </InfoDescription>
        </PopoverInfo>
      )}
    </PopoverDialog>
  );
}

AddCollectionProjectPop.propTypes = {
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

const AddCollectionProject = ({ collection, addProjectToCollection }) => (
  <PopoverWithButton buttonText="Add Project">
    {({ togglePopover }) => (
      <AddCollectionProjectPop collection={collection} addProjectToCollection={addProjectToCollection} togglePopover={togglePopover} />
    )}
  </PopoverWithButton>
);

AddCollectionProject.propTypes = {
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default AddCollectionProject;