import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverDialog, PopoverMenuButton, PopoverActions } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

const deleteCollection = (collection, deleteCollection) => {
  (<DeleteCollection collection={collection} deleteCollection={deleteCollection} />);
};

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <PopoverMenu>
      {() => (
        <PopoverDialog focusOnDialog align="right">
          <PopoverActions type="dangerZone">
            <PopoverMenuButton onClick={deleteCollection(collection, deleteCollection)} label="Delete Collection" emoji="bomb" />
          </PopoverActions>
        </PopoverDialog>
      )}
    </PopoverMenu>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
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