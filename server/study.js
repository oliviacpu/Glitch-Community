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

const writeAssignment = (response, test, assignment) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  response.cookie(`test-${test}`, assignment, { maxAge });
};

const assignGroup = (groups) => {
  const sum = Object.values(groups).reduce((sum, { weight }) => sum + weight, 0);
  let rand = Math.random() * sum;
  for (const [assignment, { weight }] in Object.entries(groups)) {
    rand -= weight;
    if (rand < 0) {
      return assignment;
    }
  }
};

const getAssignments = (request, response) => {
  const assignments = {};
  for (const [test, groups] in Object.entries(tests)) {
    let assignment = readAssignment(request, test);
    if (!Object.keys(groups).includes(assignment)) {
      assignment = assignGroup(groups);
    }
    assignments[test] = [assignment, groups[assignment]];
  }
  return assignments;
};

module.exports = getAssignments;
