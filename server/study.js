const dayjs = require('dayjs');

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

const tests = {
  'Just-A-Test': {
    winner: { weight: 0.75 },
    loser: { weight: 0.25 },
  },
};

const readAssignment = (request, test) => {
  return request.cookies[test] || null;
};

const writeAssignment = (response, test, group) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  response.cookie(`test-${test}`, group, { maxAge });
};

const getAssignments = (request, response) => {
  const assignments = {};

};

module.exports = getAssignments;
