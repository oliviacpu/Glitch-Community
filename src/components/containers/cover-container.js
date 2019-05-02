import React from 'react';
import PropTypes from 'prop-types';
import Button from 'Components/buttons/button';

import { getProfileStyle as getTeamProfileStyle } from 'Models/team';
import { getProfileStyle as getUserProfileStyle } from 'Models/user';
import { useTrackedFunc } from '../../presenters/segment-analytics';
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
              <Button key={label} size="small" type="tertiary" onClick={useTrackedFunc(onClick, label)}>
                {label}
              </Button>
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
