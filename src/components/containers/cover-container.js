import React from 'react';
import PropTypes from 'prop-types';
import { getProfileStyle as getTeamProfileStyle } from '../../models/team';
import { getProfileStyle as getUserProfileStyle } from '../../models/user';
import styles from './cover-container.styl';

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
};

const CoverContainer = ({ buttons, children, type, item }) => {
  const cache = item._cacheCover; // eslint-disable-line no-underscore-dangle
  return (
    <div className={styles.coverContainer} style={getProfileStyles[type]({ ...item, cache })}>
      {children}
      <div className={styles.buttonWrap}>
        {buttons}
      </div>
    </div>
  );
};

CoverContainer.propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

CoverContainer.defaultProps = {
  buttons: null,
};

export default CoverContainer;
