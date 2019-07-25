import React, { createContext, useState } from 'react';

const createCounter = () => {
  let counter = 0;
  return () => {
    counter += 1;
    return counter;
  }
};

const Context = createContext(createCounter());

let counter = 0;

const useUniqueId = () => {
  const getCounter = useContext(Context);
  const [uniqueId] = useState(getCounter);
  return `unique-${uniqueId}`;
};

const UniqueIdProvider = ({ children }) => {
  const getCounter = useState(createCounter);
  return <Context.Provider value={getCounter}>{children}
};

export default useUniqueId;
