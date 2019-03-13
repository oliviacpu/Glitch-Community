import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);


const Image = ({ src }) => {
  return <img src={src} />
}



Image.propTypes = {
  src: PropTypes.string.isRequired
};

Image.defaultProps = {
  align: ['center'],
  children: null,
  tooltip: '',
  persistent: false,
};

export default Image;
