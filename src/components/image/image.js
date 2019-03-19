import React from 'react';
import PropTypes from 'prop-types';

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
 * @param {object} className - extra classes to be passed down  to the component
 * @param {boolean} backgroundImage - If we want the image to be rendered as a background image
 */

const Image = ({ src, srcSet, className, alt, role, width, onClick, onKeyUp, height }) => {
  return (
    <img
      src={src}
      srcSet={srcSet ? srcSet : undefined}
      width={width || undefined}
      height={height || undefined}
      className={className || undefined}
      alt={alt}
      role={role}
    />
  );
};

Image.propTypes = {
  alt: PropTypes.string,
  srcSet: PropTypes.instanceOf(Object),
  role: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  backgroundImage: PropTypes.bool,
  backgroundRatio: PropTypes.number,
  onClick: PropTypes.func,
  extraClassNames: PropTypes.instanceOf(Object),
};

Image.defaultProps = {
  src: '',
  srcSet: {},
  alt: '',
  backgroundImage: false,
  backgroundRatio: 50,
  role: '',
  width: '',
  height: '',
  extraClassNames: {},
};

export default Image;
