import React from 'react';

let counter = 0;

const useUniqueId = (prefix = Math.random()) => {
  const [uniqueId] = React.useState(() => {
    counter += 1;
    return counter;
  });
  return `${prefix}-${uniqueId}`;
};

export default useUniqueId;
