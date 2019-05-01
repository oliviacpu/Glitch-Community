import React from 'react';
import PropTypes from 'prop-types';

import styles from './overlay-title.styl';

const OverlayTitle = ({ children }) => {
  return (
    <h1 className={styles.title}>
      {children}
    </h1>
  );
};

OverlayTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlayTitle;
