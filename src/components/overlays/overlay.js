import React from 'react';
import PropTypes from 'prop-types';

import styles from './overlay.styl';

const Overlay = ({ children }) => {
  <dialog className={styles.overlay} open>
    {children}
  </dialog>
};

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Overlay;
