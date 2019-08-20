const dayjs = require('dayjs');

const tests = {
  'Just-A-Test': {
    winner: { weight: 1 },
    loser: { weight: 1000000 },
  },
};

const COOKIE_NAME = 'ab-tests';

const readAssignments = (request) => {
  try {
    const serialized = request.cookies[COOKIE_NAME] || '{}';
    return JSON.parse(serialized) || {};
  } catch {
    return {};
  }
};

const writeAssignments = (response, assignments) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  const whitelist = Object.keys(tests).sort();
  const serialized = JSON.stringify(assignments, whitelist);
  response.cookie(COOKIE_NAME, serialized, { maxAge });
};

const assignGroup = (groups) => {
  const entries = Object.entries(groups);
  const sum = Object.values(groups).reduce((sum, { weight }) => sum + weight, 0);

  // pick a number in [0, sum) and see which [0, weight) range it falls in
  let rand = Math.random() * sum;
  for (const [assignment, { weight }] of entries) {
    if (rand < weight) {
      return assignment;
    }
    rand -= weight;
  }

  // this must be a rounding error, so return the last group
  return entries[entries.length - 1][0];
};

const getAssignments = (request, response) => {
  const assignments = readAssignments(request);
  for (const [test, groups] of Object.entries(tests)) {
    let assignment = assignments[test];
    if (!Object.keys(groups).includes(assignment)) {
      assignment = assignGroup(groups);
    }
    assignments[test] = assignment;
  }
  writeAssignments(response, assignments);
  return Object.fromEntries(Object.keys(tests).map((test) => ));
};

module.exports = getAssignments;
