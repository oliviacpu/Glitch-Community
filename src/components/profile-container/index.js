import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';
import Button from 'Components/buttons/button';
import { getAvatarStyle as getUserAvatarStyle } from 'Models/user';
import { getAvatarStyle as getTeamAvatarStyle } from 'Models/team';
import { useTrackedFunc } from '../../presenters/segment-analytics';
import styles from './styles.styl';

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

const getStyle = {
  user: getUserAvatarStyle,
  team: (team) => getTeamAvatarStyle({ ...team, cache: team._cacheAvatar }), // eslint-disable-line no-underscore-dangle
};

const ProfileContainer = ({ item, type, children, avatarActions, coverActions, teams }) => (
  <CoverContainer type={type} item={item} buttons={<TrackedButtonGroup items={coverActions} />}>
    <div className={styles.profileWrap}>
      <div className={styles.avatarContainer}>
        <div className={classnames(styles.avatar, styles[type])} style={getStyle[type](item)} />
        <div className={styles.avatarButtons}>
          <TrackedButtonGroup items={avatarActions} />
        </div>
      </div>
      <div className={styles.profileInfo}>{children}</div>
    </div>
    {!!teams && !!teams.length && (
      <div className={styles.teamsContainer}>
        <ProfileList layout="block" teams={teams} />
      </div>
    )}
  </CoverContainer>
);

ProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
  coverActions: PropTypes.object,
  teams: PropTypes.array,
};

ProfileContainer.defaultProps = {
  avatarActions: {},
  coverActions: {},
  teams: [],
};

export default ProfileContainer;
