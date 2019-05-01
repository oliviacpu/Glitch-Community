import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';
import Button from 'Components/buttons/button';
import { getAvatarStyle as getUserAvatarStyle } from 'Models/user';
import { getAvatarStyle as getTeamAvatarStyle } from 'Models/team';
import { getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import { useTrackedFunc } from '../../presenters/segment-analytics';
import styles from './styles.styl';


const getStyle = {
  user: getUserAvatarStyle,
  team: (team) => 
};

const ProfileContainer = ({ item, children, avatarActions, coverActions, teams }) => {
  const hasTeams = !!(teams && teams.length);
  return (
    <CoverContainer type={type} item={item} buttons={<TrackedButtonGroup items={coverActions} />}>
      <div className={classnames(styles.profileWrap, hasTeams && styles.hasTeams)}>
        <div className={styles.avatarContainer}>
          <div className={classnames(styles.avatar, styles[type])} style={getTeamAvatarStyle({ ...item, cache: item._cacheAvatar }), // eslint-disable-line no-underscore-dangle} />
          <div className={styles.avatarButtons}>
            <TrackedButtonGroup items={avatarActions} />
          </div>
        </div>
        <div className={styles.profileInfo}>{children}</div>
      </div>
    </CoverContainer>
  );
};

ProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
  coverActions: PropTypes.object,
};

ProfileContainer.defaultProps = {
  avatarActions: {},
  coverActions: {},
};

export default ProfileContainer;
