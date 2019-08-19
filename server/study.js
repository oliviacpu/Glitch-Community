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
    writeAssignment(response, test, assignment);
    assignments[test] = [assignment, groups[assignment]];
  }
  return assignments;
};

module.exports = getAssignments;
