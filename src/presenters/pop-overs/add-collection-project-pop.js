// add-collection-project-pop -> Add a project to a collection via the collection page
import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { debounce } from 'lodash';

import { getAllPages } from 'Shared/api';
import Loader from 'Components/loader';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAPI, createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import ProjectResultItem from '../includes/project-result-item';
import ProjectsLoader from '../projects-loader';
import { useNotifications, AddProjectToCollectionMsg } from '../notifications';
import PopoverWithButton from './popover-with-button';

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

function AddCollectionProjectPop({ collection, initialProjects, togglePopover, addProjectToCollection }) {
  const [query, setQuery] = useState('');
  const parsedQuery = parseQuery(query);
  const { projects: retrievedProjects, status } = useAlgoliaSearch(parsedQuery, { types: ['projects'] });
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

  const projects = parsedQuery.lengtth ? initialProjects : retrievedProjects; 
  const idsOfProjectsInCollection = new Set(collection.projects.map((p) => p.id));
  const [projectsAlreadyInCollection, newProjectsToAdd] = partition(projects, (project) => idsOfProjectsInCollection.has(project.id));
  const excludedProjectsCount = projectsAlreadyInCollection.length;
  const excludingExactMatch = projectsAlreadyInCollection.some((p) => p.domain === parsedQuery);

  return (
    <PopoverDialog wide align="right">
      <PopoverInfo>
        <TextInput
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          value={query}
          onChange={setQuery}
          placeholder="Search by project name or URL"
        />
      </PopoverInfo>

      {status === 'loading' && (
        <PopoverInfo>
          <Loader />
        </PopoverInfo>
      )}
      {status === 'ready' && newProjectsToAdd.length > 0 && (
        <PopoverSection>
          <ResultsList items={newProjectsToAdd}>
            {(project) => (
              <ProjectResultItem
                domain={project.domain}
                description={project.description}
                users={project.users}
                id={project.id}
                isActive={false}
                collection={collection}
                onClick={() => onClick(project)}
                isPrivate={project.private}
              />
            )}
          </ResultsList>
        </PopoverSection>
      )}
      {status === 'ready' && newProjectsToAdd.length === 0 && excludingExactMatch && (
        <PopoverInfo>
          <p>
            {parsedQuery} is already in this collection <Emoji name="sparkles" />
          </p>
        </PopoverInfo>
      )}
      {status === 'ready' && newProjectsToAdd.length === 0 && !excludingExactMatch && (
        <PopoverInfo>
          <p>
            nothing found <Emoji name="sparkles" />
          </p>
          {projectsAlreadyInCollection.length > 0 && (
            <p>
              Excluded <Pluralize count={projectsAlreadyInCollection.length} singular="search result" />
            </p>
          )}
        </PopoverInfo>
      )}
    </PopoverDialog>
  );
}

AddCollectionProjectPop.propTypes = {
  collection: PropTypes.object.isRequired,
  initialProjects: PropTypes.array.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

const useTeamProjects = createAPIHook(async (api, teamId) => {
  if (teamId > 0) {
    const projects = await getAllPages(api, `/v1/teams/by/id/projects?limit=100&orderKey=updatedAt&orderDirection=ASC&id=${teamId}`);
    return projects;
  }
  return null;
});

function AddCollectionProject({ collection, addProjectToCollection }) {
  const teamResponse = useTeamProjects(collection.teamId);
  const { currentUser } = useCurrentUser();

  let initialProjects = [];
  if (teamResponse.status === 'ready' && teamResponse.value) {
    initialProjects = teamResponse.value;
  } else {
    initialProjects = currentUser.projects;
  }

  return (
    <PopoverWithButton buttonClass="add-project" buttonText="Add Project">
      {({ togglePopover }) => (
        <AddCollectionProjectPop
          collection={collection}
          initialProjects={initialProjects.slice(0, 20)}
          addProjectToCollection={addProjectToCollection}
          togglePopover={togglePopover}
        />
      )}
    </PopoverWithButton>
  );
}

AddCollectionProject.propTypes = {
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default AddCollectionProject;
