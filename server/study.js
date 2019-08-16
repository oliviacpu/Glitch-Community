const dayjs = require('dayjs');
const Study = require('studyjs');

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

const tests = [
  {
    name: 'Just-A-Test',
    buckets: {
      winner: { weight: 0.75 },
      loser: { weight: 0.25 },
    },
  },
];

const runStudy = (request, response) => {
  const store = createStore(request, response);
  const study = new Study({ store });
  tests.forEach((test) => study.define(test));
};

module.exports = runStudy;
