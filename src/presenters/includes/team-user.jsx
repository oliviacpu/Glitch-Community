import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';

const TeamUser = (props) => {
  let {user} = props;
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <React.Fragement>
          <button className="user team-user-avatar" title={user.login} onClick={togglePopover} data-tooltip={user.tooltipName} data-tooltip-left="true" style={user.style}>
            <img width="32" height="32" src={user.userAvatarUrl} alt={`User Properties for ${user.login}`}/>
          </button>
          {visible && <UserInfoPop {...props}/>}
        </React.Fragement>
      )}
    </PopoverContainer>
  );
};

TeamUser.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    tooltipName: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

export default TeamUser;