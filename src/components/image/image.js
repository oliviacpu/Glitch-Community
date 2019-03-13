import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

const Image = ({ src, className, alt, role }) => {
  const classes = cx({
    className,
  });
  return <img src={src} className={classes} alt={alt} />;
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
  src: PropTypes.string.isRequired,
};

Image.defaultProps = {};

export default Image;
