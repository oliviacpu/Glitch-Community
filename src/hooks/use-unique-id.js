import React from 'react';

let counter = 0;

const useUniqueId = () => {
  const [uniqueId] = React.useState(() => {
    counter += 1;
    return counter;
  });
  return `unique-${uniqueId}`;
};

export default useUniqueId;
