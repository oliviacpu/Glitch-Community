import React, { useEffect, useState } from 'react';

/* Usage
<Video className="whatever" src={[{ minWidth: '0', src: '' }, { minWidth: '750', src: ''}]} />
*/

function Video({ sources, ...props }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [visibleSources, setVisibleSources] = useState([]);
  useEffect(() => {
    setVisibleSources(sources.filter((s) => windowWidth >= s.minWidth).map(s => s.src));
  }, [windowWidth]);

  return (
    <video {...props}>
      {visibleSources.map(src => (<source key={src} src={src} />))}
    </video>
  );
}

export default Video;
