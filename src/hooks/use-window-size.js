import React, { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState([800, 600]);
  useEffect(() => {
    const handleResize = () => setWindowSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowSize;
};

export default useWindowSize;
