const dayjs = require('dayjs');

const tests = {
  'Just-A-Test': {
    winner: { weight: 0.75 },
    loser: { weight: 0.25 },
  },
};

const readAssignment = (request, test) => {
  return request.cookies[`test-${test}`] || null;
};

const writeAssignment = (response, test, assignment) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  response.cookie(`test-${test}`, assignment, { maxAge });
};

const assignGroup = (groups) => {
  const entries = Object.entries(groups);
  const sum = Object.values(groups).reduce((sum, { weight }) => sum + weight, 0);
  
  let rand = Math.random() * sum;
  for (const [assignment, { weight }] of entries) {
    rand -= weight;
    if (rand < 0) {
      return assignment;
    }
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
