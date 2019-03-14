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

const maxImageWidth = (dimensions) => {
  const { screen } = window;
  const imgWidth = dimensions.width;
  const sWidth = screen.width;
  const sHeight = screen.height;

  const { documentElement } = document;
  const windowWidth = window.innerWidth || documentElement.clientWidth;
  const windowHeight = window.innerHeight || documentElement.clientHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;

  const windowResized = sWidth > windowWidth;

  let result;
  if (windowResized) {
    const body = document.getElementsByTagName('body')[0];
    const scrollWidth = windowWidth - imgWidth;
    const isScroll = body.clientHeight > windowHeight || body.clientHeight > sHeight;
    if (isScroll && scrollWidth <= 15) {
      result = sWidth - scrollWidth;
    } else {
      result = (imgWidth / windowWidth) * sWidth;
    }
  } else {
    result = imgWidth;
  }

  return result * devicePixelRatio;
};

const ImageSet = ({ images }) => {
  return <></>;
};

ImageSet.propTypes = {
  images: PropTypes.array.isRequired,
};

const Image = ({ src, className, alt, role, width, height, srcSet }) => {
  let classes = cx({
    [className]: className !== undefined,
    width: width,
    height: height,
  });
  role = !role && alt === '' ? 'presentation' : '';
  if (srcSet) {
    const guessMaxImageWidth({ width, height });
  }
  return <img src={src} srcSet={srcSet} className={classes} alt={alt} role={role} otherProps />;
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
