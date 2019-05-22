import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { partition } from 'lodash';

import { getAllPages } from 'Shared/api';
import Loader from 'Components/loader';
import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverInfo, InfoDescription } from 'Components/popover';
import TextInput from 'Components/inputs/text-input';
import ResultsList from 'Components/containers/results-list';
import Emoji from 'Components/images/emoji';
import { useTrackedFunc } from 'State/segment-analytics';
import { createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useAlgoliaSearch } from 'State/search';

import { useNotifications, AddProjectToCollectionMsg } from '../notifications';
const styles = {}

// const useUsers = createAPIHook(async (api, project) => {
//   const result
// })

const Foo = () => (
  <Foo/>
  
)

const ProjectResultItem = ({ project, onClick }) => {
  const { value: users } = useUsers(project)
  return (
    <div className={classnames(styles.projectResult, project.isPrivate && styles.private)}>
      <TransparentButton onClick={onClick}>
        <ProjectAvatar {...project}/>
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>
            {project.domain}
          </div>
          {description.length > 0 && (
            
            <div className={styles.resultDescription}>
              <Markdown renderAsPlaintext>{project.description}</Markdown>
            </div>
          )}
          {!!users && users.length > 0 && <ProfileList users={users} layout="row" />}
        </div>
        </TransparentButton>
      <Button size="small" href={getProjectLink(project)}>
        View →
      </Button>
    </div>
  );
};


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

function AddCollectionProjectPop({ collection, togglePopover, addProjectToCollection }) {
  const [query, setQuery] = useState('');
  const parsedQuery = parseQuery(query);
  const { project: retrievedProjects, status } = useAlgoliaSearch(parsedQuery);

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

  const projects = parsedQuery.length ? retrievedProjects : initialProjects;
  const idsOfProjectsInCollection = new Set(collection.projects.map((p) => p.id));
  const [projectsAlreadyInCollection, newProjectsToAdd] = partition(projects, (project) => idsOfProjectsInCollection.has(project.id));
  const excludingExactMatch = projectsAlreadyInCollection.some((p) => p.domain === parsedQuery);

  return (
    <PopoverDialog wide align="left">
      <PopoverInfo>
        <TextInput
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          value={query}
          onChange={setQuery}
          labelText="Project name or URL"
          placeholder="Search by project name or URL"
        />
      </PopoverInfo>

      {status === 'loading' && (
        <PopoverInfo>
          <Loader />
        </PopoverInfo>
      )}
      {status === 'ready' && excludingExactMatch && (
        <PopoverInfo>
          <p>
            {parsedQuery} is already in this collection <Emoji name="sparkles" />
          </p>
        </PopoverInfo>
      )}
      {newProjectsToAdd.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={newProjectsToAdd.slice(0, 10)}>
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
      {status === 'ready' && newProjectsToAdd.length === 0 && !excludingExactMatch && (
        <PopoverInfo>
          <InfoDescription>
            nothing found <Emoji name="sparkles" />
          </InfoDescription>
          {projectsAlreadyInCollection.length > 0 && (
            <InfoDescription>
              Excluded <Pluralize count={projectsAlreadyInCollection.length} singular="search result" />
            </InfoDescription>
          )}
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
