import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const Context = createContext({});

export const GlobalsProvider = ({ children, origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES }) => {
  const value = useMemo(() => ({
    origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES,
  }), [origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
  HOME_CONTENT: PropTypes.object.isRequired,
  EXTERNAL_ROUTES: PropTypes.array.isRequired,
};

export const useGlobals = () => useContext(Context);
