const { envs } = require('Shared/constants');
/* globals RUNNING_ON */

let currentEnv;
if (RUNNING_ON === 'development') {
  currentEnv = 'development';
} else if (RUNNING_ON === 'staging') {
  currentEnv = 'staging';
} else if (RUNNING_ON === 'production') {
  currentEnv = 'production';
} else if (document.location.hostname.indexOf('glitch.development') >= 0) {
  currentEnv = 'development';
} else if (document.location.hostname.indexOf('staging.glitch.com') >= 0) {
  currentEnv = 'staging';
} else {
  currentEnv = 'production';
}

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
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
};
