import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Video({ sources, muted, ...props }) {
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
      const videos = filterVideos();

      // confirm that videos with audio have a caption track
      if (!muted) {
        for (const video of visibleVideos) {
          if (!video.track) {
            throw new Error(`No caption track provided for asset ${video.src}`);

            // if a video has words, it needs a complete caption track
            // if the video has background music but no lyrics or words, use a .vtt file that describes the mood of the music:
            //
            // WEBVTT
            //
            // 00:01.00 --> 00:14.00
            // (CHEERFUL POLKA MUSIC)
          }
        }
      }
      setVisibleVideos(videos);
    },
    [windowWidth],
  );

  // disabling this rule here because the linter doesn't understand that the track is inside .map
  return (
    <video muted {...props}>
      {/* eslint-disable-line jsx-a11y/media-has-caption */}
      {visibleVideos.map((video) => (
        <React.Fragment key={video.src}>
          {video.track && <track kind="captions" src={video.track} srcLang="en" />}
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
