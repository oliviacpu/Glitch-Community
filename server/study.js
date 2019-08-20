const dayjs = require('dayjs');

const tests = {
  'Just-A-Test': {
    winner: { weight: 1 },
    loser: { weight: 1000000 },
  },
};

const COOKIE_PREFIX = 'test-';

const readAssignment = (request, test) => {
  return request.cookies[`${COOKIE_PREFIX}${test}`] || null;
};

const writeAssignment = (response, test, assignment) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  response.cookie(`${COOKIE_PREFIX}${test}`, assignment, { maxAge });
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
  const assignments = {};
  for (const [test, groups] of Object.entries(tests)) {
    let assignment = readAssignment(request, test);
    if (!Object.keys(groups).includes(assignment)) {
      assignment = assignGroup(groups);
    }

    writeAssignment(response, test, assignment);
    assignments[test] = [assignment, groups[assignment]];
  }
  return assignments;
};

module.exports = getAssignments;
