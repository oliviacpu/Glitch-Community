import React from 'react';
import PropTypes from 'prop-types';

import styles from './overlay-section.styl';

const OverlaySection = ({ children, type }) => {
  const className = type;
  return (
    <section className={className}>
      {children}
    </section>
  );
};

OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export default OverlaySection;