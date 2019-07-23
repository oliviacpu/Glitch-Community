const { envs } = require('Shared/constants');

const getBrowserEnv = () => {
  const runningOn = window.RUNNING_ON;

  let envFromOrigin = 'production';
  if (window.location.origin.includes('staging.glitch.com')) {
    envFromOrigin = 'staging';
  } else if (window.location.origin.includes('glitch.development')) {
    envFromOrigin = 'development';
  }

  return envs[runningOn] ? runningOn : envFromOrigin;
};

const getNodeEnv = () => {
  const runningOn = process.env.RUNNING_ON;
  return envs[runningOn] ? runningOn : 'production';
};

const isBrowser = typeof window !== 'undefined';
const currentEnv = isBrowser ? getBrowserEnv() : getNodeEnv();

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
  isBrowser,
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
};
