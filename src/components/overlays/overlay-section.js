import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './overlay-section.styl';

const OverlaySection = ({ children, type }) => {
  const sectionClass = classNames(styles.section, styles[type]);
  return (
    <section className={sectionClass}>
      {children}
    </section>
  );
};

OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export default OverlaySection;