import React from 'react';
import PropTypes from 'prop-types';

import Button from 'Components/buttons/button';
import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile/profile-list';

import { useTrackedFunc } from '../segment-analytics';

// Image Buttons

export const ImageButtons = ({ name, uploadImage, clearImage }) => {
  const onClickUpload = useTrackedFunc(uploadImage, `Upload ${name}`);
  const onClickClear = useTrackedFunc(clearImage, `Clear ${name}`);
  return (
    <div className="upload-image-buttons">
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

// Project Info Container

export const ProjectInfoContainer = ({ style, children, buttons }) => (
  <>
    <div className="avatar-container">
      <div className="user-avatar" style={style} />
      {buttons}
    </div>
    <div className="profile-information">{children}</div>
  </>
);
ProjectInfoContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};
ProjectInfoContainer.defaultProps = {
  buttons: null,
};

// Info Container (generic)

export const InfoContainer = ({ children }) => <div className="profile-info">{children}</div>;
InfoContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


// Profile Container

export class ProfileContainer extends React.PureComponent {
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
