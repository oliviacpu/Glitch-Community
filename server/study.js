const study = require('studyjs');

const createStore = (request, response) => {
  const get = (key) => {
    return request.cookies[key] || null;
  };
  const set = (key, value) => {

  };
  return {
    get, set,
    type: 'expressCookies',
    isSupported: () => true,
  };
};
