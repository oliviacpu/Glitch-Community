import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { getDisplayName } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import { useAPI, createAPIHook } from 'State/api';
import { PopoverContainer, PopoverDialog, PopoverInfo, PopoverActions, InfoDescription } from 'Components/popover';
import AddTeamUserPop from 'Components/team-users/add-team-user';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';

import TeamUserPop from '../../presenters/pop-overs/team-user-info-pop';
import { useNotifications } from '../../presenters/notifications';

// Invited user icon and pop

function InvitedUser(props) {
  const api = useAPI();
  const { createNotification, createErrorNotification } = useNotifications();

  // resend the invite
  const resendInvite = async () => {
    try {
      await api.post(`/teams/${props.teamId}/sendJoinTeamEmail`, { userId: props.user.id });
      createNotification(`Resent invite to ${props.user.name}!`, 'notifySuccess');
    } catch (error) {
      captureException(error);
      createErrorNotification('Invite not sent, try again later');
    }
  };

  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => (
        <div style={{ position: 'relative' }}>
          <TransparentButton onClick={togglePopover}>
            <UserAvatar user={props.user} />
          </TransparentButton>

          {visible && (
            <PopoverDialog align="left">
              <PopoverInfo>
                <div className={styles.avatar}>
                  <UserLink user={props.user}>
                    <UserAvatar user={props.user} />
                  </UserLink>
                </div>
                <div className={styles.nameLoginWrap}>
                  <h3 className={styles.name} title={props.user.name}>
                    {props.user.name || 'Anonymous'}
                  </h3>
                  {props.user.login && (
                    <p className={styles.userLogin} title={props.user.login}>
                      @{props.user.login}
                    </p>
                  )}
                </div>
              </PopoverInfo>

              <PopoverActions>
                <Button onClick={resendInvite} type="tertiary" size="small" hasEmoji>
                  Resend invite <Emoji name="herb" />
                </Button>
              </PopoverActions>

              <PopoverActions type="dangerZone">
                <Button onClick={props.onRevokeInvite} type="dangerZone" hasEmoji>
                  Remove <Emoji name="wave" />
                </Button>
              </PopoverActions>
            </PopoverDialog>
          )}
        </div>
      )}
    </PopoverContainer>
  );
}

InvitedUser.propTypes = {
  user: PropTypes.object.isRequired,
  teamId: PropTypes.number.isRequired,
};

// Whitelisted domain icon

const WhitelistedDomain = ({ domain, setDomain }) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => (
      <div style={{ position: 'relative' }}>
        <TransparentButton onClick={togglePopover}>
          <TooltipContainer
            id="whitelisted-domain-tooltip"
            type="action"
            tooltip={visible ? null : `Anyone with an @${domain} email can join`}
            target={
              <div className={styles.whitelistedDomainIconWrap}>
                <WhitelistedDomainIcon domain={domain} />
              </div>
            }
          />
        </TransparentButton>
        {visible && (
          <PopoverDialog focusOnDialog align="left">
            <PopoverInfo>
              <InfoDescription>Anyone with an @{domain} email can join</InfoDescription>
            </PopoverInfo>
            {!!setDomain && (
              <PopoverActions type="dangerZone">
                <Button type="dangerZone" size="small" onClick={() => setDomain(null)}>
                  Remove {domain} <Emoji name="bomb" />
                </Button>
              </PopoverActions>
            )}
          </PopoverDialog>
        )}
      </div>
    )}
  </PopoverContainer>
);

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};

WhitelistedDomain.defaultProps = {
  setDomain: null,
};

// Join Team

const JoinTeam = ({ onClick }) => (
  <button className="button button-small button-cta join-team-button" onClick={onClick}>
    Join Team
  </button>
);

const useInvitees = createAPIHook(async (api, team, currentUserIsOnTeam) => {
  if (!currentUserIsOnTeam) return [];
  if (!team.tokens.length) return [];

  try {
    const idString = team.tokens.map(({ userId }) => `id=${userId}`).join('&');
    const { data } = await api.get(`v1/users/by/id?${idString}`);
    const invitees = Object.values(data);
    return invitees;
  } catch (error) {
    if (!error.response || error.response.status !== 404) {
      captureException(error);
    }
    return [];
  }
});

const TeamUserContainer = ({ team, removeUserFromTeam, updateUserPermissions, updateWhitelistedDomain, inviteEmail, inviteUser, joinTeam }) => {
  const { currentUser } = useCurrentUser();
  const [invitee, setInvitee] = useState('');
  const [newlyInvited, setNewlyInvited] = useState([]);
  const [removedInvitees, setRemovedInvitee] = useState([]);
  const { createNotification, createErrorNotification } = useNotifications();
  const api = useAPI();

  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });
  const currentUserCanJoinTeam = userCanJoinTeam({ team, user: currentUser });
  const { value } = useInvitees(team, currentUserIsOnTeam);
  const invitees = (value || []).concat(newlyInvited).filter((el) => (el !== removedInvitees));

  const members = uniq([...team.users, ...invitees].map((user) => user.id));

  const onInviteUser = async (user) => {
    setNewlyInvited((invited) => [...invited, user]);
    console.log('invitee', invitee);
    console.log('newlyInvited', newlyInvited);
    try {
      await inviteUser(user);
      setInvitee(getDisplayName(user));
      createNotification(`Invited ${getDisplayName(user)}!`, 'notifySuccess');
    } catch (error) {
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
      captureException(error);
    }
  };

  const onInviteEmail = async (email) => {
    setInvitee(email);
    try {
      await inviteEmail(email);
      createNotification(`Invited ${email}!`, 'notifySuccess');
    } catch (error) {
      captureException(error);
    }
  };

  return (
    <ul className={styles.container}>
      {team.users.map((user) => (
        <li key={user.id} className={styles.teamMember}>
          <TeamUserPop team={team} user={user} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
        </li>
      ))}
      {!!team.whitelistedDomain && (
        <li className={styles.whitelistedDomain}>
          <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
        </li>
      )}
      {invitees.map((user) => (
        <li key={user.id} className={styles.invitedMember}>
          <InvitedUser
            user={user}
            teamId={team.id}
            onRevokeInvite={async () => {
              setRemovedInvitee((removed) => [...removed, user]);
              try {
                await api.post(`/teams/${team.id}/revokeTeamJoinToken/${user.id}`);
                setInvitee(invitee.filter((el) => (el !== getDisplayName(user))));
                createNotification(`Removed ${user.name} from team`);
                console.log('removedInvitees', removedInvitees);
                console.log('invitee', invitee);
              } catch (error) {
                captureException(error);
                createErrorNotification("Couldn't revoke invite, Try again later");
              }
            }}
          />
        </li>
      ))}
      {currentUserIsOnTeam && (
        <li className={styles.addButtonWrap}>
          <AddTeamUserPop
            inviteEmail={inviteEmail ? onInviteEmail : null}
            inviteUser={inviteUser ? onInviteUser : null}
            setWhitelistedDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null}
            members={members}
            whitelistedDomain={team.whitelistedDomain}
          />
        </li>
      )}
      {currentUserCanJoinTeam && (
        <li className={styles.joinButtonWrap}>
          <JoinTeam onClick={joinTeam} />
        </li>
      )}
    </ul>
  );
};

export default TeamUserContainer;
