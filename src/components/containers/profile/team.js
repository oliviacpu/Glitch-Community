import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';
import Button from 'Components/buttons/button';
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

const TrackedButtonGroup = ({ items }) => {
  if (!items) return null;
  return (
    <>
      {Object.entries(items)
        .filter(([, onClick]) => onClick)
        .map(([label, onClick]) => (
          <TrackedButton key={label} label={label} onClick={onClick} />
        ))}
    </>
  );
};

const TeamProfileContainer = ({ item, children, avatarActions, coverActions, teams }) => {
  const hasTeams = !!(teams && teams.length);
  return (
    <CoverContainer type='team' item={item} buttons={<TrackedButtonGroup items={coverActions} />}>
      <div className={classnames(styles.profileWrap, hasTeams && styles.hasTeams)}>
        <div className={styles.avatarContainer}>
          <div className={classnames(styles.avatar, styles.team)} style={getTeamAvatarStyle({ ...item, cache: item._cacheAvatar })} />
          // eslint-disable-line no-underscore-dangle
          <div className={styles.avatarButtons}>
            <TrackedButtonGroup items={avatarActions} />
          </div>
        </div>
        <div className={styles.profileInfo}>{children}</div>
      </div>
    </CoverContainer>
  );
};

TeamProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
  coverActions: PropTypes.object,
};

TeamProfileContainer.defaultProps = {
  avatarActions: {},
  coverActions: {},
};

export default TeamProfileContainer;
