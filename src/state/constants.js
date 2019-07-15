import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getConstants } from 'Utils/constants';

const Context = createContext();

export const ConstantsProvider = ({ children, origin, runningOn }) => {
  const value = useMemo(() => getConstants(origin, runningOn), [origin, runningOn]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
ConstantsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  runningOn: PropTypes.string.isRequired,
};

export const useConstants = () => useContext(Context);

export default useConstants;
