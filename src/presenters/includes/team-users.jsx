import React from 'react';
import PropTypes from 'prop-types';

import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

//this file exists as a shim for the team page until it gets reactified and this can go inline

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  <UserPopoversList users={users}>
    {user => <UserInfoPop user={user} currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={() => removeUserFromTeam(user)} />}
  </UserPopoversList>
);

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

export default TeamUsers;