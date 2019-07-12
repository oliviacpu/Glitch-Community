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

  const filterVideos = () => sources.filter((s) => windowWidth >= s.minWidth && (s.maxWidth && windowWidth <= s.maxWidth));
  const [visibleVideos, setVisibleVideos] = useState(filterVideos());
  useEffect(
    () => {
      setVisibleVideos(filterVideos());
      console.log(visibleVideos);
    },
    [windowWidth],
  );

  console.log(visibleVideos);
  return (
    <video {...props}>
      {visibleVideos.map((video) => (
        <source key={video.src} src={video.src} />
      ))}
    </video>
  );
}

Video.propTypes = {
  captionTrack: PropTypes.string,
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
