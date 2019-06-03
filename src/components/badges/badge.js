import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './badge.styl';

const cx = classNames.bind(styles);

export const TYPES = ['success', 'warning', 'error', 'private'];

/**
 * Badge Component
 */
const Badge = ({ type, children }) => {
  const className = cx({ badge: true, [type]: true });
  return <div className={className}>{children}</div>;
};

Badge.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(TYPES),
};

Badge.defaultProps = {
  type: null,
};

export default Badge;
