const { Cache } = require('memory-cache');
const { captureException } = require('@sentry/node');

const getOrNull = async (label, func, ...args) => {
  try {
    return await func(...args);
  } catch (error) {
    console.warn(`Failed to ${label}: ${error.toString()}`);
    captureException(error);
    return null;
  }
};

module.exports = (timeout, verb) => {
  const cache = new Cache();

  return async (key, func, ...args) => {
    let promise = cache.get(key);
    if (!promise) {
      promise = getOrNull(`${verb} ${key}`, func, ...args);
      cache.put(key, promise, timeout);
    }
    return promise;
  }
};
