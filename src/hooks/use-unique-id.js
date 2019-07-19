import React from 'react';

let counter = 0;

const useUniqueId = () => {
  const [uniqueId] = React.useState(() => {
    counter += 1;
    return counter;
  });
<<<<<<< HEAD
  return `${Date.now()}-${uniqueId}`;
=======
  return `unique-${uniqueId}`;
>>>>>>> 00dac0d31a40e99c5a3e5a99393580c0158763fa
};

export default useUniqueId;
