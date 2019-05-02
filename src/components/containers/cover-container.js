import React from 'react';
import PropTypes from 'prop-types';
import TrackedButton from 'Components/buttons/tracked-button';

import { getProfileStyle as getTeamProfileStyle } from 'Models/team';
import { getProfileStyle as getUserProfileStyle } from 'Models/user';
import styles from './cover-container.styl';

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
};

const CoverContainer = ({ coverActions, children, type, item }) => {
  const cache = item._cacheCover; // eslint-disable-line no-underscore-dangle
  return (
    <div className={styles.coverContainer} style={getProfileStyles[type]({ ...item, cache })}>
      {children}
      <div className={styles.buttonWrap}>
        {coverActions &&
          Object.entries(coverActions)
            .filter(([, onClick]) => onClick)
            .map(([label, onClick]) => (
              <TrackedButton key={label} size="small" type="tertiary" label={label} onClick={onClick}>
                {label}
              </TrackedButton>
            ))}
      </div>
    </div>
  );
};

CoverContainer.propTypes = {
  coverActions: PropTypes.object,
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

CoverContainer.defaultProps = {
  coverActions: undefined,
};

export default CoverContainer;
