import React from 'react';
import PropTypes from 'prop-types';

import useLocalStorage from 'State/local-storage';

export const Context = React.createContext();

export const UserPrefsProvider = ({ children }) => {
  const [prefs, set] = useLocalStorage('community-userPrefs', {});
  return <Context.Provider value={{ prefs, set }}>{children}</Context.Provider>;
};
UserPrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useUserPref = (name, defaultValue) => {
  const { prefs, set } = React.useContext(Context);
  const value = prefs[name] !== undefined ? prefs[name] : defaultValue;
  const setValue = (newValue) => set({ ...prefs, [name]: newValue });
  return [value, setValue];
};

export default useUserPref;
