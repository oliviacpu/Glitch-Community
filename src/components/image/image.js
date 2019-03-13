import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);


const Image = ({ src, className }) => {
  return <img src={src} className={classNames([className])} />
}



Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isREquired
};

Image.defaultProps = {
  align: ['center'],
  children: null,
  tooltip: '',
  persistent: false,
};

export default Image;
