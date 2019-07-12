import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Video({ sources, ...props }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filterVideos = () => sources.filter((s) => windowWidth >= s.minWidth && (!s.maxWidth || windowWidth <= s.maxWidth));
  const [visibleVideos, setVisibleVideos] = useState(filterVideos());
  useEffect(
    () => {
      setVisibleVideos(filterVideos());
    },
    [windowWidth],
  );

  // disabling this rule here because the linter doesn't understand that the track is inside .map
  return (
    <video {...props}>{/* eslint-disable-line jsx-a11y/media-has-caption */}
      {visibleVideos.map((video) => (
        <React.Fragment key={video.src}>
          <track kind="captions" src={video.track} srcLang="en" />
          <source key={video.src} src={video.src} />
        </React.Fragment>
      ))}
    </video>
  );
}

Video.propTypes = {
  sources: PropTypes.array.isRequired,
  muted: PropTypes.bool,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  poster: PropTypes.string,
};

Video.defaultProps = {
  muted: false,
  autoPlay: false,
  loop: false,
  controls: false,
  poster: '',
};

export default Video;
