import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { getDisplayName } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import { createAPIHook } from 'State/api';
import { PopoverContainer, PopoverDialog, PopoverActions } from 'Components/popover';
import AddTeamUserPop from 'Components/team-users/add-team-user';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop';
import { captureException } from '../../utils/sentry';

// Whitelisted domain icon

const tooltip = `Anyone with an @${domain} email can join`;
const WhitelistedDomain = ({ domain, setDomain }) =>  (
    <PopoverContainer>
      {() => (
        <PopoverContainer focusOnPopover>
          <summary>
            <TooltipContainer
              id="whitelisted-domain-tooltip"
              type="action"
              tooltip={tooltip}
              target={
                <div>
                  <WhitelistedDomainIcon domain={domain} />
                </div>
              }
            />
          </summary>
          <dialog className="pop-over">
            <section className="pop-over-info">
              <p className="info-description">{tooltip}</p>
            </section>
            {!!setDomain && (
              <section className="pop-over-actions danger-zone">
                <button className="button button-small button-tertiary button-on-secondary-background has-emoji" onClick={() => setDomain(null)}>
                  Remove {domain} <span className="emoji bomb" />
                </button>
              </section>
            )}
          </dialog>
        </details>
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

  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });
  const currentUserCanJoinTeam = userCanJoinTeam({ team, user: currentUser });
  const { value } = useInvitees(team, currentUserIsOnTeam);
  const invitees = value || [];

  const members = uniq([...team.users, ...invitees, ...newlyInvited].map(user => user.id))

  const onInviteUser = async (user) => {
    setNewlyInvited((invited) => [...invited, user]);
    try {
      await inviteUser(user);
      setInvitee(getDisplayName(user));
    } catch (error) {
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
      captureException(error);
    }
  };

  const onInviteEmail = async (email) => {
    setInvitee(email);
    try {
      await inviteEmail(email);
    } catch (error) {
      captureException(error);
    }
  };

  const removeNotifyInvited = () => {
    setInvitee('');
  };

  return (
    <>
      <TeamUserInfoPop team={team} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
      {!!team.whitelistedDomain && (
        <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
      )}
      {currentUserIsOnTeam && (
        <AddTeamUserPop
          inviteEmail={inviteEmail ? onInviteEmail : null}
          inviteUser={inviteUser ? onInviteUser : null}
          setWhitelistedDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null}
          members={members}
          whitelistedDomain={team.whitelistedDomain}
        />
      )}
      {!!invitee && (
        <div className="notification notifySuccess inline-notification" onAnimationEnd={removeNotifyInvited}>
          Invited {invitee}
        </div>
      )}

      {currentUserCanJoinTeam && <JoinTeam onClick={joinTeam} />}
    </>
  );
};

export default TeamUserContainer;
