import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './animations.styl';

const types = ['slideDown', 'slideUp'];

const AnimationContainer = ({ type, children, className, onAnimationEnd }) => {
  const [state, setState] = useState({ active: false, handlerArgs: [] });

  return (
    <div className={classnames(className, state.active && styles[type])} onAnimationEnd={() => onAnimationEnd(...state.handlerArgs)}>
      {children((...handlerArgs) => setState({ active: true, handlerArgs }))}
    </div>
  );
};
AnimationContainer.propTypes = {
  type: PropTypes.oneOf(types).isRequired,
  children: PropTypes.func.isRequired,
  onAnimationEnd: PropTypes.func.isRequired,
  className: PropTypes.string,
};

AnimationContainer.defaultProps = {
  className: '',
};

export default AnimationContainer;
