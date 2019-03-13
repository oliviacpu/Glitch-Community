import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

const Image = ({ src, className, alt }) => {
  return <img src={src} className={classNames([className])} alt={alt} />;
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

Image.defaultProps = {
  
};

export default Image;
