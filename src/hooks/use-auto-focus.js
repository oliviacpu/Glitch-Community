import React, {useEffect} from 'react';

export const useFocusFirst = useEffect(() => {
  const [url, hash] = window.location.href.split('#');
  if (hash) {
    const firstHeading  = document.querySelectorAll(`#${hash} > h1:first-of-type, #${hash} > h2:first-of-type`)[0];

    firstHeading.setAttribute('tabIndex', -1);
    firstHeading.focus();
  }
}, []);
