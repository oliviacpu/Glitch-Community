import React from "react";
import PropTypes from "prop-types";

import { UserAvatar } from 'Components/images/avatar';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';

import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';


import PopoverContainer from './presenters/pop-overs/popover-container';
import Notifications from './presenters/notifications';


function InvitedUserPop (props) {
  // state
  // done, false by default
  
  // resend the invite
  const resendInvite = () => {};
  
  // revoke the invite
  const revokeInvite = () => {};
  
}

InvitedUserPop.PropTypes = {
  
};