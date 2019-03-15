import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['tertiary', 'cta', 'dangerZone'];
export const SIZES = ['small'];

/**
 * Button Component
 */
const Button = ({ onClick, disabled, type, size, hover, children }) => {
  const className = cx({
    btn: true,
    cta: type === 'cta',
    small: size === 'small',
    tertiary: ['tertiary', 'dangerZone'].includes(type),
    dangerZone: type === 'dangerZone',
    hover,
  });

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
  /** whether or not the button's hover state should be active */
  hover: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  type: '',
  size: '',
  hover: false,
};

export default Button;
