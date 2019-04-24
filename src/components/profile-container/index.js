import React from 'react';
import PropTypes from 'prop-types';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';
import Button from 'Components/buttons/button';
import { useTrackedFunc } from '../../presenters/segment-analytics';

const InfoContainer = ({ children }) => <div className="profile-info">{children}</div>;

const TrackedButton = ({ label, onClick }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button size="small" type="tertiary" onClick={trackedOnClick}>
      {label}
    </Button>
  );
};

const TrackedButtonGroup = ({ items }) => (
  <>
    {Object.entries(items)
      .filter(([, onClick]) => onClick)
      .map(([label, onClick]) => (
        <TrackedButton key={label} label={label} onClick={onClick} />
      ))}
  </>
);

const ProfileContainer = ({ avatarStyle, avatarActions, type, item, coverActions, children, teams }) => (
  <CoverContainer type={type} item={item} buttons={<TrackedButtonGroup items={coverActions} />}>
    <InfoContainer>
      <div className="avatar-container">
        <div className="user-avatar" style={avatarStyle} />
        <TrackedButtonGroup items={avatarActions} />
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

ProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOfType(['user', 'team']).isRequired,
  children: PropTypes.node.isRequired,
  avatarStyle: PropTypes.object,
  avatarActions: PropTypes.object,
  coverActions: PropTypes.object,
  teams: PropTypes.array,
};

ProfileContainer.defaultProps = {
  avatarStyle: {},
  avatarActions: {},
  coverActions: {},
  teams: [],
};

export default ProfileContainer;
