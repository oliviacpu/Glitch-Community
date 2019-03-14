import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './image.styl';

const cx = classNames.bind(styles);

/*
If we have a src set - figure out how big the screen is and apply the correct image
If we don't, just display the image with width/height props
* srcSet = [
  'large' => ['width' => '100%', src='']
]
*/


const Image = ({ src, className, alt, role, width, height }) => {
  let classes = cx({
    [className]: className !== undefined,
    'width': width,
    'height': height
  });
  // If no alt, we assume this is just for visuals
  role = !role && alt === '' ? 'presentation' : '';
  return <img src={src} className={classes} alt={alt} role={role} otherProps />;
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  role: PropTypes.string,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
};

Image.defaultProps = {
  role: '',
  srcSet: [],
  width: '100%',
  height: '100%'
};

export default Image;
