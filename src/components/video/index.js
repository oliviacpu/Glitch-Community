import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Video({ sources, track, ...props }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
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
    [windowWidth, sources],
  );

  // disabling this rule here because the linter doesn't understand that the track is inside .map
  return (
    <video muted={track === 'muted'} {...props}> {/* eslint-disable-line jsx-a11y/media-has-caption */}
      {visibleVideos.map((video) => (
        <React.Fragment key={video.src}>
          {track !== 'muted' && <track kind="captions" src={track} srcLang="en" />}
          <source key={video.src} src={video.src} />
        </React.Fragment>
      ))}
    </video>
  );
}

Video.propTypes = {
  sources: PropTypes.array.isRequired,
  // if a video has words, it needs a complete caption track
  // if the video has background music but no lyrics or words, use a .vtt file that describes the mood of the music:
  //
  // WEBVTT
  //
  // 00:01.00 --> 00:14.00
  // (CHEERFUL POLKA MUSIC)
  track: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  poster: PropTypes.string,
};

Video.defaultProps = {
  autoPlay: false,
  loop: false,
  controls: false,
  poster: '',
};

export default Video;
