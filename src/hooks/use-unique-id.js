import React, { createContext, useContext, useState } from 'react';

const createCounter = () => {
  let counter = 0;
  return () => {
    counter += 1;
    return counter;
  };
};

const Context = createContext(createCounter());

const useUniqueId = () => {
  const getCounter = useContext(Context);
  const [uniqueId] = useState(getCounter);
  return `unique-${uniqueId}`;
};

export const UniqueIdProvider = ({ children }) => {
  const getCounter = useState(createCounter);
  return <Context.Provider value={getCounter}>{children}</Context.Provider>;
};

export default useUniqueId;
