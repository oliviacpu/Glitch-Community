import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const { envs } = require('Shared/constants');

const Context = createContext();

export const ConstantsProvider = ({ origin, runningOn }) => {
  let envFromOrigin = 'production';
  if (origin.contains('staging.glitch.com')) {
    envFromOrigin = 'staging';
  } else if (origin.contains('glitch.development')) {
    envFromOrigin = 'development';
  }
  const currentEnv = envs[runningOn] ? runningOn : envFromOrigin;
};
ConstantsProvider.propTypes = {
  origin: PropTypes.string.isRequired,
  runningOn: PropTypes.string.isRequired,
};

export const useConstants = () => useContext(Context);

export default useConstants;

let env;
if (RUNNING_ON === 'development') {
  env = 'development';
} else if (RUNNING_ON === 'staging') {
  env = 'staging';
} else if (RUNNING_ON === 'production') {
  env = 'production';
} else if (document.location.hostname.indexOf('glitch.development') >= 0) {
  env = 'development';
} else if (document.location.hostname.indexOf('staging.glitch.com') >= 0) {
  env = 'staging';
} else {
  env = 'production';
}
const currentEnv = env;

const {
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
} = envs[currentEnv];

export {
  currentEnv,
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
};
