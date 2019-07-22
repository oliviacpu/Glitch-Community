const { envs } = require('Shared/constants');

const getCurrentEnv = () => {
  if (typeof window !== 'undefined') {
    const runningOn = window.RUNNING_ON;

    let envFromOrigin = 'production';
    if (window.location.origin.includes('staging.glitch.com')) {
      envFromOrigin = 'staging';
    } else if (window.location.origin.includes('glitch.development')) {
      envFromOrigin = 'development';
    }

    return envs[runningOn] ? runningOn : envFromOrigin;
  } else if (typeof process !== 'undefined') {
    const runningOn = process.env.RUNNING_ON;
    return envs[runningOn] ? runningOn : 'production';
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
