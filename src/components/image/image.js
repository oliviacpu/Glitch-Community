import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

const Image = ({ src, className, alt, role, ...otherProps }) => {
  let classes = cx({
    [className]: className !== undefined,
  });
  // If no alt, we assume this is just for visuals
  role = !role && alt === '' ? 'presentation' : '';
  return <img src={src} className={classes} alt={alt} role={role} otherProps />;
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
  src: PropTypes.string.isRequired,
};

Image.defaultProps = {
  role: '',
};

export default Image;
