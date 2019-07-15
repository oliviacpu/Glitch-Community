const { envs } = require('Shared/constants');

export const getCurrentEnv = (origin, runningOn) => {
  let envFromOrigin = 'production';
  if (origin.contains('staging.glitch.com')) {
    envFromOrigin = 'staging';
  } else if (origin.contains('glitch.development')) {
    envFromOrigin = 'development';
  }
  return envs[runningOn] ? runningOn : envFromOrigin;
};

export const getConstants = (origin, runningOn) => {
  const currentEnv = getCurrentEnv(origin, runningOn);
  return { ...envs[currentEnv], currentEnv };
};
