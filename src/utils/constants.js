const { envs } = require('Shared/constants');
/* global RUNNING_ON */

// The current environment is based on the RUNNING_ON environment variable,
// unless we're running under a staging/dev hostname, in which case we use the
// corresponding environment config.
function getCurrentEnv() {
  if (origin.includes('staging.glitch.com')) {
    return 'staging';
  }
  if (origin.includes('glitch.development')) {
    return 'development';
  }
  if (envs[RUNNING_ON]) {
    return RUNNING_ON;
  }
  return 'production';
}

const currentEnv = getCurrentEnv();

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
