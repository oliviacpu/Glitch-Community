// create-collection-pop.jsx -> add a project to a new user or team collection
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { kebabCase, orderBy } from 'lodash';

import Loader from 'Components/loader';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TextInput from 'Components/inputs/text-input';
import { PopoverDialog, MultiPopoverTitle, PopoverActions, PopoverWithButton } from 'Components/popover';
import Button from 'Components/buttons/button';
import { createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI, createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { getAllPages } from 'Shared/api';

import { AddProjectToCollectionMsg, useNotifications } from '../../presenters/notifications';
import Dropdown from '../../presenters/pop-overs/dropdown';
// import styles from './popover.styl';

// Format in { value: teamId, label: html elements } format for react-select
function getOptions(currentUser) {
  const userOption = {
    value: null,
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
    label: (
      <span id={team.id}>
        {team.name}
        <TeamAvatar team={team} hideTooltip />
      </span>
    ),
  }));
  return [userOption, ...teamOptions];
}

const useCollections = createAPIHook((api, teamId, currentUser) => {
  if (teamId) {
    return getAllPages(api, `/v1/teams/by/id/collections?id=${teamId}&limit=100`);
  }
  return getAllPages(api, `/v1/users/by/id/collections?id=${currentUser.id}&limit=100`);
});

function CreateCollectionPopBase({ title, onSubmit, options }) {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

  const [selection, setSelection] = useState(options[0]);
  const hasTeams = currentUser.teams.length > 0;

  const [loading, setLoading] = useState(false);
  // TODO: should this be pre-populated with a friendly name?
  const [collectionName, setCollectionName] = useState('');

  // determine if entered name already exists for selected user / team
  const { value: collections } = useCollections(selection.value, currentUser);
  const hasQueryError = (collections || []).some((c) => c.url === kebabCase(collectionName));
  const error = hasQueryError ? 'You already have a collection with this name' : '';

  const submitDisabled = loading || collectionName.length === 0;

  async function handleSubmit(event) {
    if (submitDisabled) return;
    event.preventDefault();
    setLoading(true);
    const collection = await createCollection(api, collectionName, selection.value, createNotification);
    onSubmit(collection);
  }

  return (
    <PopoverDialog wide align="right">
      {title}

      <PopoverActions>
        <form onSubmit={handleSubmit}>
          <TextInput
            value={collectionName}
            onChange={setCollectionName}
            error={error}
            placeholder="New Collection Name"
            labelText="New Collection Name"
          />

          {options.length > 1 && (
            <div>
              {'for '}
              <Dropdown containerClass="user-or-team-toggle" options={options} selection={selection} onUpdate={(value) => setSelection(value)} />
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Button size="small" onClick={handleSubmit} disabled={submitDisabled}>
              Create
            </Button>
          )}
        </form>
      </PopoverActions>
    </PopoverDialog>
  );
}

// TODO: figure out relationship between addProjectToCollection and redirecting to collection page
CreateCollectionPopBase.propTypes = {
  addProjectToCollection: PropTypes.func,
  project: PropTypes.object,
  togglePopover: PropTypes.func.isRequired,
  onProjectAddedToCollection: PropTypes.func,
  onSubmit: PropTypes.func,
};

CreateCollectionPopBase.defaultProps = {
  addProjectToCollection: null,
  onProjectAddedToCollection: () => {},
  onSubmit: () => {},
};

function CreateCollectionWithProject({ project, addProjectToCollection }) {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const options = getOptions(currentUser);
  const track = useTracker('Create Collection clicked', (inherited) => ({
    ...inherited,
    origin: `${inherited.origin} project`,
  }));
  const onSubmit = (collection) => {
    track();
    if (!collection || !collection.id) return;
    const addProject = addProjectToCollection || ((project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`));

    try {
      // TODO: should this block?
      addProject(project, collection);

      // TODO: does this have fullUrl?
      const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />;
      createNotification(content, 'notifySuccess');
    } catch (e) {
      createNotification('Unable to add project to collection.', 'notifyError');
    }
  };
  const title = <MultiPopoverTitle>{`Add ${project.domain} to a new collection`}</MultiPopoverTitle>;

  return <CreateCollectionPopBase title={title} onSubmit={onSubmit} />;
}

const redirectTo = {};

const CreateCollectionPop = ({ team }) => {
  const { cufrent}
  const options = team ? createOptions(null, [team]) : createOptions(currentUser)
  
  return (
    <PopoverWithButton buttonText="Create Collection">
      {() => <CreateCollectionPopBase onSubmit={(collection) => redirectTo(collection.fullUrl)} />}
    </PopoverWithButton>
  );
};
export default CreateCollectionPop;
