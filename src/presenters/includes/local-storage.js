import React from 'react';
import { captureException } from '../../utils/sentry';
import { storage, readFromStorage, writeToStorage } from '../../state/local-storage';


const useLocalStorage = (name, defaultValue) => {
  const [rawValue, setValueInMemory] = React.useState(() => readFromStorage(name));

  React.useEffect(() => {
    const reload = (event) => {
      if (event.storageArea === storage && event.key === name) {
        setValueInMemory(readFromStorage(name));
      }
    };
    window.addEventListener('storage', reload, { passive: true });
    return () => {
      window.removeEventListener('storage', reload, { passive: true });
    };
  }, [name]);

  const value = rawValue !== undefined ? rawValue : defaultValue;
  const setValue = (newValue) => {
    setValueInMemory(newValue);
    writeToStorage(name, newValue);
  };

  return [value, setValue];
};

export default useLocalStorage;
