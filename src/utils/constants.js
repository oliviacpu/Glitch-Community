const { envs } = require('Shared/constants');

const getCurrentEnv = () => {
  try {
    // try loading constants as if we're a browser
    const runningOn = window.RUNNING_ON;

    let envFromOrigin = 'production';
    if (window.location.origin.includes('staging.glitch.com')) {
      envFromOrigin = 'staging';
    } else if (window.location.origin.includes('glitch.development')) {
      envFromOrigin = 'development';
    }

    return envs[runningOn] ? runningOn : envFromOrigin;
  } catch (error) {
    // oops, that didn't work. we must be in node
    const runningOn = process.env.RUNNING_ON;
    return envs[runningOn] ? runningOn : 'production';
  }
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
