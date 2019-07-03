import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getOwnerLink, getLink } from 'Models/collection';
import Image from 'Components/images/image';
import Loader from 'Components/loader';
import { PopoverDialog, PopoverActions, PopoverTitle, MultiPopover, MultiPopoverTitle, ActionDescription, PopoverWithButton, PopoverMenuButton } from 'Components/popover';
import { deleteCollection as deleteCollectionViaState } from 'State/collection';
import { useNotifications } from 'State/notifications';
import { useAPI } from 'State/api';

const DeleteCollectionPop = withRouter(({ history, collection, animateAndDeleteCollection }) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const [collectionIsDeleting, setCollectionIsDeleting] = useState(false);
  const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

  async function deleteThisCollection() {
    if (collectionIsDeleting) return;
    setCollectionIsDeleting(true);
    try {
      if (window.location.pathname === getLink(collection)) {
        deleteCollectionViaState(api, collection);
        history.push(getOwnerLink(collection));
      } else {
        animateAndDeleteCollection(collection.id);
      }
    } catch (error) {
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setCollectionIsDeleting(false);
    }
  }

  return (
    <PopoverDialog focusOnDialog align="left">
      <PopoverTitle>Delete {collection.name}</PopoverTitle>
      <PopoverActions>
        <Image height="98px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Deleting {collection.name} will remove this collection. No projects will be deleted.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <PopoverMenuButton size="small" label={`Delete ${collection.name}`} type="dangerZone" emoji="bomb" onClick={deleteThisCollection}>
          {collectionIsDeleting && <Loader />}
        </PopoverMenuButton>
      </PopoverActions>
    </PopoverDialog>
  );
});
/*
function TeamUserRemovePop({ user, onRemoveUser, userTeamProjects }) {
  const [selectedProjects, setSelectedProjects] = useState([]);
  function selectAllProjects() {
    setSelectedProjects(userTeamProjects.map((p) => p.id));
  }

  function unselectAllProjects() {
    setSelectedProjects([]);
  }

  const allProjectsSelected = userTeamProjects.every((p) => selectedProjects.includes(p.id));

  return (
    <PopoverDialog align="left" focusOnPopover>
      <MultiPopoverTitle>Remove {getDisplayName(user)}</MultiPopoverTitle>

      {!userTeamProjects && (
        <PopoverActions>
          <Loader />
        </PopoverActions>
      )}
      {userTeamProjects && userTeamProjects.length > 0 && (
        <PopoverActions>
          <ActionDescription>Also remove them from these projects</ActionDescription>
          <ProjectsList options={userTeamProjects} value={selectedProjects} onChange={setSelectedProjects} />
          {userTeamProjects.length > 1 && allProjectsSelected && (
            <Button size="small" onClick={unselectAllProjects}>
              Unselect All
            </Button>
          )}
          {userTeamProjects.length > 1 && !allProjectsSelected && (
            <Button size="small" onClick={selectAllProjects}>
              Select All
            </Button>
          )}
        </PopoverActions>
      )}

      <PopoverActions type="dangerZone">
        <Button type="dangerZone" onClick={() => onRemoveUser(selectedProjects)}>
          Remove{' '}
          <span className={styles.tinyAvatar}>
            <UserAvatar user={user} />
          </span>
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
}

    <PopoverContainer>
      {({ visible, togglePopover, toggleAndCall }) => (
        <div style={{ position: 'relative' }}>
          <TransparentButton onClick={togglePopover}>
            <UserAvatar user={user} suffix={adminStatusDisplay(team.adminIds, user)} withinButton />
          </TransparentButton>

          {visible && (
            <MultiPopover
              views={{
                remove: () => <TeamUserRemovePop user={user} userTeamProjects={userTeamProjects} onRemoveUser={toggleAndCall(removeUser)} />,
              }}
            >
              {(showViews) => (
                <TeamUserInfo
                  user={user}
                  team={team}
                  onRemoveAdmin={toggleAndCall(onRemoveAdmin)}
                  onMakeAdmin={toggleAndCall(onMakeAdmin)}
                  onRemoveUser={() => onOrShowRemoveUser(showViews.remove, togglePopover)}
                />
              )}
            </MultiPopover>
          )}
        </div>
      )}
    </PopoverContainer>
*/

const DeleteCollection = ({ collection, deleteCollection }) => (
  <PopoverWithButton buttonProps={{ size: 'small', type: 'dangerZone', emoji: 'bomb' }} buttonText={`Delete ${collection.name}`}>
    {() => <DeleteCollectionPop collection={collection} animateAndDeleteCollection={deleteCollection} />}
  </PopoverWithButton>
);

DeleteCollection.propTypes = {
  collection: PropTypes.shape({
    team: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteCollection;
