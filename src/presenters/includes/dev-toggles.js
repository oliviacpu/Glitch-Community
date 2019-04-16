import React from 'react';
import PropTypes from 'prop-types';
import useUserPref from './user-prefs';

const Context = React.createContext();

//  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//

// Define your dev toggles here.
// We can only have three.
// Users can enable them with the /secret page.
const toggleData = [
  {
    name: 'Email Invites',
    description: 'Enables invite-by-email behavior on the team page.',
  },
  {
    name: 'Slack Auth',
    description: 'Sign in with your Slack account!',
  },
  {
    name: 'Algolia Search',
    description: 'Use the new Algolia-powered search API.',
  },
].slice(0, 3); // <-- Yeah really, only 3.  If you need more, clean up one first.

// Usage:
//
// import useDevToggle from '../includes/dev-toggles`
//
// const NewFeatureIfEnabled = () => {
//   const showNewFeature = useDevToggle('New Feature');
//   return showNewFeature ? <NewFeature /> : null;
// };

export const DevTogglesProvider = ({ children }) => {
  const [enabledToggles, setEnabledToggles] = useUserPref('devToggles', []);
  return <Context.Provider value={{ enabledToggles, toggleData, setEnabledToggles }}>{children}</Context.Provider>;
};
DevTogglesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDevToggles = () => React.useContext(Context);

const useDevToggle = (toggle) => {
  const { enabledToggles } = useDevToggles();
  return enabledToggles.includes(toggle);
};

export default useDevToggle;
