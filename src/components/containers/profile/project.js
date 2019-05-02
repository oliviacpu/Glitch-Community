import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from 'Components/buttons/button';
import { getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import { useTrackedFunc } from '../../../presenters/segment-analytics';
import styles from './styles.styl';

const ProjectProfileContainer = ({ item, children, avatarActions }) => {
  let avatarStyle;
  if (item.suspendedReason && avatarActions === undefined) {
    avatarStyle = { backgroundImage: `url('https://cdn.glitch.com/2b785d6f-8e71-423f-b484-ec2383060a9b%2Fno-entry.png?1556733100930')` }; // eslint-disable-line no-underscore-dangle
  } else {
    avatarStyle = { backgroundImage: `url('${getProjectAvatarUrl(item.id)}?${item._avatarCache}')` }; // eslint-disable-line no-underscore-dangle
  }
  return (
    <div className={styles.profileWrap}>
      <div className={styles.avatarContainer}>
        <div className={classnames(styles.avatar, styles.project)} style={avatarStyle} />
        <div className={styles.avatarButtons}>
          {avatarActions &&
            Object.entries(avatarActions)
              .filter(([, onClick]) => onClick)
              .map(([label, onClick]) => (
                <Button key={label} size="small" type="tertiary" onClick={() => useTrackedFunc(onClick, label)}>
                  {label}
                </Button>
              ))}
          }
        </div>
      </div>
      <div className={styles.profileInfo}>{children}</div>
    </div>
  );
};

ProjectProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
};

ProjectProfileContainer.defaultProps = {
  avatarActions: {},
};

export default ProjectProfileContainer;
