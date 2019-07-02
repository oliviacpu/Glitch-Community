import useLocalStorage from 'State/local-storage';

const useUserPref = (name, defaultValue) => {
  const [prefs, set] = useLocalStorage('community-userPrefs', {});
  const value = prefs[name] !== undefined ? prefs[name] : defaultValue;
  const setValue = (newValue) => set({ ...prefs, [name]: newValue });
  return [value, setValue];
};

export default useUserPref;
