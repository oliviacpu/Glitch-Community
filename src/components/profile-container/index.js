import React from 'react';
import PropTypes from 'prop-types';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';

const InfoContainer = ({ children }) => <div className="profile-info">{children}</div>;

class ProfileContainer extends React.PureComponent {
  render() {
    const { avatarStyle, avatarButtons, type, item, coverButtons, children, teams } = this.props;
    return (
      <CoverContainer type={type} item={item} buttons={coverButtons}>
        <InfoContainer>
          <div className="avatar-container">
            <div className="user-avatar" style={avatarStyle} />
            {avatarButtons}
          </div>
          <div className="profile-information">{children}</div>
        </InfoContainer>
        {!!teams && !!teams.length && (
          <div className="teams-information">
            <ProfileList layout="block" teams={teams} />
          </div>
        )}
      </CoverContainer>
    );
  }
}

export default ProfileContainer;