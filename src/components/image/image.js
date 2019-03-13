import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

const Image = ({ src, className, alt, role, ...otherProps }) => {
  console.log('image', className, src);
  let classes = [cx, className].join(' ');
  console.log('classes', classes);
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
