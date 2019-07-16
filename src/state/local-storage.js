import React from 'react';
import { captureException } from 'Utils/sentry';

const getStorage = () => {
  try {
    const storage = window.localStorage;
    storage.setItem('test', 'test');
    storage.getItem('test');
    storage.removeItem('test');
    return storage;
  } catch (error) {
    console.warn('Local storage not available');
  }
  try {
    const storage = window.sessionStorage;
    storage.setItem('test', 'test');
    storage.getItem('test');
    storage.removeItem('test');
    return storage;
  } catch (error) {
    console.warn('Session storage not available');
  }
  return null;
};

const readFromStorage = (storage, name) => {
  if (storage) {
    try {
      const raw = storage.getItem(name);
      if (raw !== null) {
        return JSON.parse(raw);
      }
    } catch (error) {
      captureException(error);
    }
  }
  return undefined;
};

const writeToStorage = (storage, name, value) => {
  if (storage) {
    try {
      if (value !== undefined) {
        storage.setItem(name, JSON.stringify(value));
      } else {
        storage.removeItem(name);
      }
    } catch (error) {
      captureException(error);
    }
  }
};

const findStorage = (storageRef) => {
  if (storageRef.current === undefined) {
    storageRef.current = getStorage();
  }
};

const Context = React.createContext([() => undefined, () => {}]);

const LocalStorageProvider = ({ children }) => {
  const storageRef = React.useRef(undefined);
  const [cache, setCache] = React.useState(new Map());

  React.useEffect(() => {
    findStorage(storageRef);
    const onStorage = (event) => {
      if (event.storageArea === storageRef.current) {
        if (event.key) {
          setCache((oldCache) => {
            const newCache = new Map(oldCache);
            newCache.delete(event.key);
            return newCache;
          });
        } else {
          setCache(new Map());
        }
      }
    };
    window.addEventListener('storage', onStorage, { passive: true });
    return () => {
      window.removeEventListener('storage', onStorage, { passive: true });
    };
  }, []);

  const getValue = (name) => {
    if (!cache.has(name)) {
      findStorage(storageRef);
      const value = readFromStorage(storageRef, name);
      setCache((oldCache) => new Map([...oldCache, [name, value]]));
      return value;
    }
    return cache.get(name);
  };

  const setValue = (name, value) => {
    findStorage(storageRef);
    writeToStorage(storageRef, name, value);
    setCache((oldCache) => new Map([...oldCache, [name, value]]));
  };

  return (
    <Context.Provider value={[getValue, setValue]}>
      {children}
    </Context.Provider>
  );
};

const useLocalStorage = (name, defaultValue) => {
  const [getRawValue, setRawValue] = React.useContext(Context);
  const rawValue = getRawValue(name);

  const value = rawValue !== undefined ? rawValue : defaultValue;
  const setValue = (newValue) => setRawValue(name, newValue);

  return [value, setValue];
};

export default useLocalStorage;
export { LocalStorageProvider };
