import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const { envs } = require('Shared/constants');

const Context = createContext();

export const ConstantsProvider = ({ children, origin, runningOn }) => {
  const value = useMemo(() => {
    let envFromOrigin = 'production';
    if (origin.contains('staging.glitch.com')) {
      envFromOrigin = 'staging';
    } else if (origin.contains('glitch.development')) {
      envFromOrigin = 'development';
    }
    const currentEnv = envs[runningOn] ? runningOn : envFromOrigin;
    return { ...envs[currentEnv], currentEnv, origin };
  }, [currentEnv, origin]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
ConstantsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  runningOn: PropTypes.string.isRequired,
};

export const useConstants = () => useContext(Context);

export default useConstants;
