import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnlyTeamAdmin } from 'Models/team';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import { UserAvatar } from 'Components/images/avatar';
import Thanks from 'Components/thanks';
import { PopoverDialog, PopoverWithButton, PopoverActions, PopoverInfo, MultiPopover } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import { ProfileItem } from 'Components/profile-list';

import { useTrackedFunc } from 'State/segment-analytics';
import { createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { getAllPages } from 'Shared/api';

import { useNotifications } from '../notifications';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
};

// Team Userr Remove 💣

const TeamUserRemoveButton = ({ user, removeUser }) => (
  <button className="button-small has-emoji" onClick={removeUser} type="button">
    Remove <img className="emoji avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={{ backgroundColor: user.color }} />
  </button>
);

const TeamUserProjectsToggle = ({ userTeamProjects, selectedProjects, setSelectedProjects }) => {
  function selectAllProjects() {
    setSelectedProjects(new Set(userTeamProjects.map((p) => p.id)));
  }

  function unselectAllProjects() {
    setSelectedProjects(new Set());
  }

  function handleCheckboxChange({ target: { checked, value } }) {
    setSelectedProjects((nextSelectedProjects) => {
      nextSelectedProjects = new Set(nextSelectedProjects);
      if (checked) {
        nextSelectedProjects.add(value);
      } else {
        nextSelectedProjects.delete(value);
      }
      return nextSelectedProjects;
    });
  }
  const allProjectsSelected = userTeamProjects.every((p) => selectedProjects.has(p.id));

  return (
    <>
      <p className="action-description">Also remove them from these projects</p>
      <div className="projects-list">
        {userTeamProjects.map((project) => (
          <label key={project.id} htmlFor={`remove-user-project-${project.id}`}>
            <input
              className="checkbox-project"
              type="checkbox"
              id={`remove-user-project-${project.id}`}
              checked={selectedProjects.has(project.id)}
              value={project.id}
              onChange={handleCheckboxChange}
            />
            <img className="avatar" src={getProjectAvatarUrl(project.id)} alt="" />
            {project.domain}
          </label>
        ))}
      </div>
      {userTeamProjects.length > 1 && (
        <button className="button-small" type="button" onClick={allProjectsSelected ? unselectAllProjects : selectAllProjects}>
          {allProjectsSelected ? 'Unselect All' : 'Select All'}
        </button>
      )}
    </>
  );
};

function TeamUserRemovePop({ user, removeUser, userTeamProjects: userTeamProjectsResponse, togglePopover, focusFirstElement }) {
  const [selectedProjects, setSelectedProjects] = useState(new Set());

  const onRemoveUser = useTrackedFunc(() => {
    togglePopover();
    removeUser(Array.from(selectedProjects));
  }, 'Remove from Team submitted');

  const userTeamProjects = userTeamProjectsResponse.data || [];

  let projects = null;
  if (userTeamProjectsResponse.status === 'loading') {
    projects = <Loader />;
  } else if (userTeamProjects.length > 0) {
    projects = (
      <TeamUserProjectsToggle userTeamProjects={userTeamProjects} selectedProjects={selectedProjects} setSelectedProjects={setSelectedProjects} />
    );
  }

  return (
    <PopoverDialog align="left" focusOnPopover>
      <MultiPopoverTitle>Remove {getDisplayName(user)}</MultiPopoverTitle>

      {userTeamProjectsResponse.status === 'loading' && (
        <PopoverActions>
          <Loader />
        </PopoverActions>
      )}
      {userTeamProjectsRespons.value && }
      
        <PopoverActions>
          
        </PopoverActions>
      )}

      <PopoverActions type="dangerZone">
        <TeamUserRemoveButton user={user} removeUser={onRemoveUser} />
      </PopoverActions>
    </PopoverDialog>
  );
}

// Team User Info 😍

const TeamUserInfo = ({ user, team, onMakeAdmin, onRemoveAdmin, onRemove }) => {
  const { currentUser } = useCurrentUser();
  const currentUserIsTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  const selectedUserIsTeamAdmin = userIsTeamAdmin({ user, team });
  const selectedUserIsOnlyAdmin = userIsOnlyTeamAdmin({ user, team });
  const teamHasOnlyOneMember = team.users.length === 1;
  const currentUserHasRemovePriveleges = currentUserIsTeamAdmin || (currentUser && currentUser.id === user.id);
  const canCurrentUserRemoveUser = currentUserHasRemovePriveleges && !teamHasOnlyOneMember && !selectedUserIsOnlyAdmin;

  return (
    <PopoverDialog align="left">
      <PopoverInfo>
        <ProfileItem user={user} />
        <div className="info-container">
          <p className="name" title={user.name}>
            {user.name || 'Anonymous'}
          </p>
          {user.login && (
            <p className="user-login" title={user.login}>
              @{user.login}
            </p>
          )}
          {selectedUserIsTeamAdmin && (
            <div className="status-badge">
              <TooltipContainer
                id={`admin-badge-tooltip-${user.login}`}
                type="info"
                target={<span className="status admin">Team Admin</span>}
                tooltip="Can edit team info and billing"
              />
            </div>
          )}
        </div>
      </PopoverInfo>
      {user.thanksCount > 0 && (
        <PopoverInfo>
          <ThanksCount count={user.thanksCount} />
        </PopoverInfo>
      )}
      {currentUserIsTeamAdmin && !selectedUserIsOnlyAdmin && (
        <PopoverActions>
          <ActionDescription>Admins can update team info, billing, and remove users</ActionDescription>
          {selectedUserIsTeamAdmin ? (
            <Button size="small" type="tertiary" onClick={onRemoveAdmin}>
              Remove Admin Status <Emoji name="fast-down"/>
            </Button>
          ) : (
            <Button size="small" type="tertiary" onClick={onMakeAdmin}>
              Make an Admin <Emoji name="fast-up" />
            </Button>
          )}
        </PopoverActions>
      )}
      {canCurrentUserRemoveUser && (
        <PopoverActions type="dangerZone">
          <Button type="dangerZone" onClick={onRemove}>
            Remove from Team <Emoji name="wave" />
          </Button>
        </PopoverActions>
      )}
    </PopoverDialog>
  );
};

const useProjects = createAPIHook(async (api, userID, team) => {
  const userProjects = await getAllPages(api, `/v1/users/by/id/projects?id=${userID}&limit=100`)
  return userProjects.filter((userProj) => team.projects.some((teamProj) => teamProj.id === userProj.id))
})

const TeamUserPop = ({ team, user, removeUserFromTeam, updateUserPermissions }) => {
  const { createNotification } = useNotifications();
  const userTeamProjects = useProjects(user.id, team);
  
  async function removeUser(selectedProjects = []) {
    await removeUserFromTeam(user.id, Array.from(selectedProjects));
    createNotification(`${getDisplayName(user)} removed from Team`);
  }
  
  // TODO: is the correct part being tracked here?
  // if user is a member of no projects, skip the confirm step
  const onOrShowRemove = useTrackedFunc((showRemove) => {
    if (userTeamProjects.status === 'ready' && userTeamProjects.data.length === 0) {
      removeUser();
    } else {
      showRemove();
    }
  }, 'Remove from Team clicked');
  
  const onRemoveAdmin = useTrackedFunc(() => updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL), 'Remove Admin Status clicked');
  const onMakeAdmin = useTrackedFunc(() => updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL), 'Make an Admin clicked');
  
  return (
    <PopoverWithButton
      buttonText={<UserAvatar user={user} suffix={adminStatusDisplay(team.adminIds, user)} withinButton />}
    >
      {({ toggleAndCall }) => (
        <MultiPopover
          views={{
            remove: () => (
              <TeamUserRemovePop
                user={user}
                removeUser={removeUser}
                userTeamProjects={userTeamProjects}
              />
            )
          }}
        >
          {(showViews) => (
            <TeamUserInfo
              user={user}
              team={team}
              onRemoveAdmin={onRemoveAdmin}
              onMakeAdmin={onMakeAdmin}
              onRemove={() => onOrShowRemove(showViews.remove)}
            />
          )}
        </MultiPopover>
      )}
    </PopoverWithButton>
  );
}
  
TeamUserPop.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};

export default TeamUserPop;
