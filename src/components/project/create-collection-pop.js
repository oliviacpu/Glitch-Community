// create-collection-pop.jsx -> add a project to a new user or team collection
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { kebabCase, orderBy } from 'lodash';

import Loader from 'Components/loader';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TextInput from 'Components/inputs/text-input';
import { getLink, createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI } from 'State/api';

import { AddProjectToCollectionMsg, useNotifications } from '../notifications';
import { NestedPopoverTitle } from './popover-nested';
import Dropdown from './dropdown';

// getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
function getTeamOptions(teams) {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  const teamOptions = orderedTeams.map((team) => {
    const option = {};
    const label = (
      <span id={team.id}>
        {team.name}
        <TeamAvatar team={team} hideTooltip />
      </span>
    );
    option.value = team.id;
    option.label = label;
    return option;
  });
  return teamOptions;
}

const SubmitButton = ({ disabled }) => {
  const track = useTracker('Create Collection clicked', (inherited) => ({
    ...inherited,
    origin: `${inherited.origin} project`,
  }));
  return (
    <div className="button-wrap">
      <button type="submit" onClick={track} className="create-collection button-small" disabled={disabled}>
        Create
      </button>
    </div>
  );
};
SubmitButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const defaultAddProjectToCollection = (api, project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);

class CreateCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '', // The entered collection name
      selection: currentUserOption, // the selected option from the dropdown
    };
  }

  render() {
    const { error, query, selection, newCollectionUrl } = this.state;
    const {
      collections,
      createNotification,
      focusFirstElement,
      addProjectToCollection,
      togglePopover,
      project,
      api,
      removeProjectFromTeam,
      currentUser
    } = this.props;
    const { teams } = currentUser;
    let queryError; // if user already has a collection with the specified name

    const submitEnabled = query.length > 0;
    const placeholder = 'New Collection Name';

    // determine if entered name already exists for selected user / team
    const selectedOwnerCollections = selection.value
      ? collections.filter(({ teamId }) => teamId === selection.value)
      : collections.filter(({ userId }) => userId === currentUser.id);

    if (!!collections && selectedOwnerCollections.some((c) => c.url === kebabCase(query))) {
      queryError = 'You already have a collection with this name';
    }
    if (newCollectionUrl) {
      return <Redirect to={newCollectionUrl} />;
    }

    const handleChange = (newValue) => {
      this.setState({ query: newValue, error: null });
    };

    const setSelection = (option) => {
      this.setState({
        selection: option,
      });
    };

    const [loading, setLoading] = useState(false)
    const [{ query, error }, setQueryState] = useState({ query: '', error: null })
    const handleChange = 
    
    const setLoading = (loading) => this.setState({ loading });
    const setNewCollectionUrl = (newCollectionUrl) => this.setState({ newCollectionUrl });
    
    const currentUserOptionLabel = (
      <span>
        myself
        <UserAvatar user={currentUser} hideTooltip />
      </span>
    );
    const currentUserOption = { value: null, label: currentUserOptionLabel };

    const options = [currentUserOption].concat(getTeamOptions(currentUser.teams));

    async function handleSubmit(event) {
      event.preventDefault();
      setLoading(true);
      // create the new collection with createCollection(api, name, teamId, notification)
      const collectionResponse = await createCollection(api, query, selection.value, createNotification);
      // add the project to the collection
      if (collectionResponse && collectionResponse.id) {
        const collection = collectionResponse;
        // add the selected project to the collection
        try {
          if (addProjectToCollection) {
            addProjectToCollection(project, collection);
          } else {
            defaultAddProjectToCollection(api, project, collection);
          }
          // TODO: does this have fullUrl?
          const newCollectionUrl = `/@${collection.fullUrl}`;

          if (removeProjectFromTeam) {
            // coming from team page -> redirect to newly created collection
            setNewCollectionUrl(newCollectionUrl);
          } else {
            // show notification
            const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={newCollectionUrl} />;
            createNotification(content, 'notifySuccess');
          }
        } catch (error) {
          createNotification('Unable to add project to collection.', 'notifyError');
        }
      }
      togglePopover();
    }

    return (
      <PopoverDialog wide align="right">
        <MultiPopoverTitle>{`Add ${project.domain} to a new collection`}</MultiPopoverTitle>

        <PopoverActions>
          <form onSubmit={handleSubmit}>
            <TextInput value={query} onChange={handleChange} placeholder={placeholder} error={error || queryError} labelText={placeholder} />

            {teams && teams.length > 0 && (
              <div>
                {'for '}
                <Dropdown containerClass="user-or-team-toggle" options={options} selection={selection} onUpdate={setSelection} />
              </div>
            )}

            {!loading ? <SubmitButton disabled={!!queryError || !submitEnabled} /> : <Loader />}
          </form>
        </PopoverActions>
      </PopoverDialog>
    );
  }
}

CreateCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

CreateCollectionPop.defaultProps = {
  addProjectToCollection: null,
};

export default (props) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  return <CreateCollectionPop {...props} api={api} createNotification={createNotification} />;
};
