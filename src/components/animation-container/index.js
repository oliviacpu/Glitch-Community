import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './animations.styl';

const types = ['slideDown', 'slideUp'];

const AnimationContainer = ({ type, active, children, className, ...props }) => (
  <div className={classnames(className, active && styles[type])} {...props}>
    {children}
  </div>
);

AnimationContainer.propTypes = {
  type: PropTypes.oneOf(types).isRequired,
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

AnimationContainer.defaultProps = {
  className: '',
};

export default AnimationContainer;
