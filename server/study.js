const dayjs = require('dayjs');
const study = require('studyjs');

const createStore = (request, response) => {
  const get = (key) => {
    return request.cookies[key] || null;
  };
  const set = (key, value) => {
    const maxAge = dayjs.convert(1, 'month', 'ms');
    response.cookie(key, value, { maxAge });
  };
  return {
    get, set,
    type: 'expressCookies',
    isSupported: () => !!request.cookies && !!response.cookie,
  };
};
