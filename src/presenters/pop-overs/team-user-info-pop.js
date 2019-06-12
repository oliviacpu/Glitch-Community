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

import { useTrackedFunc, useTracker } from 'State/segment-analytics';
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

// Team User Remove 💣

const TeamUserRemoveButton = ({ user, removeUser }) => (
  <Button  type={dangerZone}  onClick={removeUser}>
    Remove <img className="emoji avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={{ backgroundColor: user.color }} />
  </Button>
);

const ProjectsList = ({ options, value, onChange }) => (
  <div className="projects-list">
    {options.map((project) => (
      <label key={project.id}>
        <input
          className="checkbox-project"
          type="checkbox"
          checked={value.has(project.id)}
          value={project.id}
          onChange={onChange}
        />
        <ProjectAvatar {...project} />
        {project.domain}
      </label>
    ))}
  </div>
)

function TeamUserRemovePop({ user, onRemoveUser, userTeamProjects }) {
  const [selectedProjects, setSelectedProjects] = useState(new Set());
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
          <ProjectsList options={userTeamProjects} value={selectedProjects} onChange={handleCheckboxChange} />
        {userTeamProjects.length > 1 && (
          <Button size="small" onClick={allProjectsSelected ? unselectAllProjects : selectAllProjects}>
            {allProjectsSelected ? 'Unselect All' : 'Select All'}
          </Button>
        )}
        </PopoverActions>
      )}
      
      <PopoverActions type="dangerZone">
        <TeamUserRemoveButton user={user} removeUser={() => onRemoveUser(Array.from(selectedProjects))} />
      </PopoverActions>
    </PopoverDialog>
  );
}

// Team User Info 😍

const TeamUserInfo = ({ user, team, onMakeAdmin, onRemoveAdmin, onRemoveUser }) => {
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
          <Button type="dangerZone" onClick={onRemoveUser}>
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
  const userTeamProjectsResponse = useProjects(user.id, team);
  const userTeamProjects = userTeamProjectsResponse.status === 'ready' ? userTeamProjectsResponse.value : null;
  
  const removeUser = useTrackedFunc(async (selectedProjects = []) => {
    await removeUserFromTeam(user.id, Array.from(selectedProjects));
    createNotification(`${getDisplayName(user)} removed from Team`);
  }, 'Remove from Team submitted');
  
  const trackRemoveClicked = useTracker('Remove from Team clicked');
  
  // TODO: is the correct part being tracked here?
  // if user is a member of no projects, skip the confirm step
  const onOrShowRemoveUser = useTrackedFunc((showRemove) => {
    if (userTeamProjects && userTeamProjects.length === 0) {
      removeUser();
    } else {
      showRemove();
      trackRemoveClicked();
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
                onRemoveUser={removeUser}
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
              onRemoveUser={() => onOrShowRemoveUser(showViews.remove)}
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
