import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

/**
  * 🖼️ Image Component
  *
  * @param {string} src - Image source
  * @param {object} srcSet - Responsive image source set
  * @param {alt} alt - Alternative text
  * @param {number} width - Image width
  * @param {number} height - Image height
  * @param {string} role - Image role (typically presentation)
  * @param {function} onClick - action if the image has one
  * @param {object} extraClassNames - extra classes to be passed down  to the component
  * @param {boolean} backgroundImage - If we want the image to be rendered as a background image
*/
const imageTag = () => {}
const backgroundTag = () => {}

const Image = ({ src, className, alt, role, width, height }) => {
  const classes = cx({
    [className]: className !== undefined,
  });
  return <img src={src} width={width} height={height} className={classes} alt={alt} role={role} otherProps />;
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

Image.defaultProps = {
  role: '',
  width: '100%',
  height: '100%',
};

export default Image;
