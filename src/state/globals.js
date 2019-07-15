import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const Context = createContext({});

export const GlobalsProvider = ({ children, origin, ZINE_POSTS, HOME_DATA }) => (
  <Context.Provider value={{ origin, ZINE_POSTS, HOME_DATA }}>{children}</Context.Provider>
);

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
  HOME_DATA: PropTypes.object.isRequired,
};

export const useGlobals = () => useContext(Context);
