import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CoverContainer from 'Components/containers/cover-container';
import Button from 'Components/buttons/button';
import { getAvatarStyle as getTeamAvatarStyle } from 'Models/team';
import { useTrackedFunc } from '../../../presenters/segment-analytics';
import styles from './styles.styl';

const TeamProfileContainer = ({ item, children, avatarActions, coverActions }) => (
  <CoverContainer type="team" item={item} coverActions={coverActions}>
    <div className={classnames(styles.profileWrap)}>
      <div className={styles.avatarContainer}>
        // eslint-disable-next-line no-underscore-dangle
        <div className={classnames(styles.avatar, styles.team)} style={getTeamAvatarStyle({ ...item, cache: item._cacheAvatar })} />
        <div className={styles.avatarButtons}>
          {avatarActions &&
            Object.entries(avatarActions)
              .filter(([, onClick]) => onClick)
              .map(([label, onClick]) => (
                <Button key={label} size="small" type="tertiary" onClick={useTrackedFunc(onClick, label)}>
                  {label}
                </Button>
              ))}
          }
        </div>
      </div>
      <div className={styles.profileInfo}>{children}</div>
    </div>
  </CoverContainer>
);

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
