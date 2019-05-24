// create-collection-pop.jsx -> add a project to a new user or team collection
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { kebabCase, orderBy } from 'lodash';

import Loader from 'Components/loader';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TextInput from 'Components/inputs/text-input';
import { getLink, createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import { AddProjectToCollectionMsg, useNotifications } from '../../presenters/notifications';
import Dropdown from '../../presenters/pop-overs/dropdown';
import styles from './popover.styl';

// getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
function getOptions(currentUser) {
  const userOption = {
    value: currentUser.id,
    type: 'user',
    label: (
      <span>
        myself
        <UserAvatar user={currentUser} hideTooltip />
      </span>
    ),
  };
  const orderedTeams = orderBy(currentUser.teams, (team) => team.name.toLowerCase());
  const teamOptions = orderedTeams.map((team) => ({
    value: team.id,
    type: 'team',
    label: (
      <span id={team.id}>
        {team.name}
        <TeamAvatar team={team} hideTooltip />
      </span>
    ),
  }));
}
function getCurrentUserOption(currentUser) {
  return 
}

const defaultAddProjectToCollection = (api) => (project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);

const useCollections = createAPIHook(async (api, selection) => {});

function CreateCollectionPop({ addProjectToCollection, togglePopover, project, onProjectAddedToCollection }) {
  const api = useAPI();
  const addProject = addProjectToCollection || defaultAddProjectToCollection(api);
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const { value: collections = [] } = useCollections();

  const options = [getCurrentUserOption(currentUser), ...getTeamOptions(currentUser.teams)];
  const [selection, setSelection] = useState(options[0]);

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // determine if entered name already exists for selected user / team
  const selectedOwnerCollections = selection.value
    ? collections.filter(({ teamId }) => teamId === selection.value)
    : collections.filter(({ userId }) => userId === currentUser.id);
  const hasQueryError = selectedOwnerCollections.some((c) => c.url === kebabCase(query));
  const queryError = hasQueryError ? 'You already have a collection with this name' : '';

  const track = useTracker('Create Collection clicked', (inherited) => ({
    ...inherited,
    origin: `${inherited.origin} project`,
  }));

  const submitEnabled = query.length > 0;
  const placeholder = 'New Collection Name';

  const [newCollectionUrl, setNewCollectionUrl] = useState(null);
  if (newCollectionUrl) {
    return <Redirect to={newCollectionUrl} />;
  }

  async function handleSubmit(event) {
    if (loading) return;
    event.preventDefault();
    setLoading(true);
    track();
    const collection = await createCollection(api, query, selection.value, createNotification);
    togglePopover();
    if (!collection || !collection.id) return;

    try {
      // TODO: should this block?
      addProject(project, collection);
      // TODO: does this have fullUrl?
      const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />;
      createNotification(content, 'notifySuccess');
      onProjectAddedToCollection(collection);
    } catch (error) {
      createNotification('Unable to add project to collection.', 'notifyError');
    }
  }

  return (
    <PopoverDialog wide align="right">
      <MultiPopoverTitle>{`Add ${project.domain} to a new collection`}</MultiPopoverTitle>

      <PopoverActions>
        <form onSubmit={handleSubmit}>
          <TextInput value={query} onChange={setQuery} placeholder={placeholder} error={queryError} labelText={placeholder} />

          {(currentUser.teams || []).length > 0 && (
            <div>
              {'for '}
              <Dropdown containerClass="user-or-team-toggle" options={options} selection={selection} onUpdate={setSelection} />
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Button size="small" onClick={handleSubmit}>
              Create
            </Button>
          )}
        </form>
      </PopoverActions>
    </PopoverDialog>
  );
}

CreateCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
};

CreateCollectionPop.defaultProps = {
  addProjectToCollection: null,
  onProjectAddedToCollection: () => {},
};

export default CreateCollectionPop;
