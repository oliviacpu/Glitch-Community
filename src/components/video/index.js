import React, { useEffect, useState } from 'react';

/* Usage
<Video className="whatever" src={[{ minWidth: '0', src: '' }, { minWidth: '750', src: ''}]} />
*/

function Video({ sources }) {
  const [windowWidth, setWindowWidth] = useState(0);
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
    <video>
      {visibleSources.map()
    </video>
  );
}
