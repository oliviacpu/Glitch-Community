import React from 'react';
import PropTypes from 'prop-types';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';

const InfoContainer = ({ children }) => <div className="profile-info">{children}</div>;

const ImageButtons = ({ name, uploadImage, clearImage }) => {
  const onClickUpload = useTrackedFunc(uploadImage, `Upload ${name}`);
  const onClickClear = useTrackedFunc(clearImage, `Clear ${name}`);
  return (
    <div>
      {!!uploadImage && (
        <Button size="small" type="tertiary" onClick={onClickUpload}>
          Upload {name}
        </Button>
      )}
      {!!clearImage && (
        <Button size="small" type="tertiary" onClick={onClickClear}>
          Clear {name}
        </Button>
      )}
    </div>
  );
};
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};
ImageButtons.defaultProps = {
  uploadImage: null,
  clearImage: null,
};

const TrackedButton = ({ label, onClick }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return <Button size="small" type="tertiary" onClick={trackedOnClick}>{label}</Button>
}

const ProfileContainer = ({ avatarStyle, avatarButtons, type, item, coverActions, coverButtons, children, teams }) => (
  <CoverContainer 
    type={type} 
    item={item} 
    buttons={<>
      {Object.entries(coverActions).map(([label, fn]) => <)}    
    </>}
  >
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

ProfileContainer.propTypes = {

}

export default ProfileContainer;