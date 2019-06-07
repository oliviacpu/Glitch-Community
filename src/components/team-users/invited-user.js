import React from 'react';
import PropTypes from 'prop-types';

import { UserAvatar } from 'Components/images/avatar';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
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
  
  return (
    <PopoverContainer>
      <UserLink user={props.user}>
        <UserAvatar user={props.user} />
        {props.user.name}
        @{props.user.login}
      </UserLink>
    </PopoverContainer>
  )
}

InvitedUserPop.PropTypes = {};
