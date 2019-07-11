const { envs } = require('Shared/constants');
/* globals RUNNING_ON */

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
