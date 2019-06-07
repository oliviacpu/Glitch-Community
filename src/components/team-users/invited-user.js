import React from 'react';
import PropTypes from 'prop-types';

import { UserAvatar } from 'Components/images/avatar';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverInfo } from 'Components/popover';
import { UserLink } from 'Components/link';

import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';
import { useAPI } from 'State/api';

import PopoverContainer from './presenters/pop-overs/popover-container';
import Notifications from './presenters/notifications';

function InvitedUserPop(props) {
  const api = useAPI();
  // state
  // done, false by default

  // resend the invite
  const resendInvite = async () => {
    const { data } = await api.post(`/teams/${props.teamId}/sendJoinTeamEmail`, { userId: props.user.id });
  };

  // revoke the invite
  const revokeInvite = async () => {
    const { data } = await api.post(`/teams/${props.teamId}/revokeTeamJoinToken/${props.user.id}`);
  
  };
  
  // user options pop
  /*
  <PopoverContainer startOpen={createTeamOpen}>
    {({ togglePopover, visible, focusFirstElement }) => {
      const userOptionsButton = (
        <button className="user" onClick={togglePopover} disabled={!props.user.id} type="button">
          <img className="user-avatar" src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options" />
          <div className="user-options-dropdown-wrap">
            <span className="down-arrow icon" />
          </div>
        </button>
      );
  */
  
  return (
    <PopoverContainer>
      <UserLink user={props.user}>
        <UserAvatar user={props.user} />
        {props.user.name}
        @{props.user.login}
      </UserLink>
      
      <section>
        <Button onClick={resendInvite} type='tertiary' hasEmoji>
          Resend invite <Emoji name='herb' />
        </Button>
      </section>
      
      <section>
        <Button onClick={revokeInvite} type='dangerZone' hasEmoji>
          Remove <Emoji name='wave' />
        </Button>
      </section>
    </PopoverContainer>
  )
}

InvitedUserPop.PropTypes = {};
