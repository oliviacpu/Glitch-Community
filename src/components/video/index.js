import React, { useEffect, useState } from 'react';

function Video({ sources, ...props }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filterVideos = () => sources.filter((s) => {
    console.log(typeof windowWidth);
    console.log(typeof s.minWidth);
    return windowWidth >= s.minWidth;
  });

  const [visibleVideos, setVisibleVideos] = useState(filterVideos());
  useEffect(
    () => {
      setVisibleVideos(filterVideos());
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

export default Video;
