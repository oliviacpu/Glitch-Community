import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const Context = createContext({});

export const GlobalsProvider = ({ children, origin, ZINE_POSTS, HOME_CONTENT }) => (
  <Context.Provider value={{ origin, ZINE_POSTS, HOME_CONTENT }}>{children}</Context.Provider>
);

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
  HOME_CONTENT: PropTypes.object.isRequired,
};

export const useGlobals = () => useContext(Context);
