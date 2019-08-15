const MemoryCache = require('memory-cache');
const { captureException } = require('@sentry/node');

module.exports = (timeout, verb) => {
  const cache = new MemoryCache();

  const getOrNull = (key, func, ...args) => {
    try {
      return await func(...args);
    } catch (error) {
      console.warn(`Failed to ${verb} ${key}: ${error.toString()}`);
      captureException(error);
      return null;
    }
  };

  return async (key, func, ...args) => {
    let promise = cache.get(key);
    if (promise) return promise;
      promise = func(...args);
      cache.put(key, promise, timeout);
    }
  }
};
