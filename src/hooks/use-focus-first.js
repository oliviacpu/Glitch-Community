import React from 'react';

const useFocusFirst = () => {
  React.useEffect(() => {
    console.log(window.location.href);
    const [, hash] = window.location.href.split('#');
    console.log(hash);
    if (hash) {
      const firstHeading = document.querySelectorAll(`#${hash} h1:first-of-type, #${hash} h2:first-of-type`)[0];
      console.log(firstHeading);
      if (firstHeading) {
        firstHeading.setAttribute('tabindex', -1);
        firstHeading.setAttribute('style', 'background-color: red');
        firstHeading.focus();
      }
    }
  }, []);
};

export default useFocusFirst;