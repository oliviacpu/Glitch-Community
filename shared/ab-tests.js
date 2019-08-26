const COOKIE_NAME = 'ab-tests';

// a test group's weight determines how likely someone is to be placed in it
// the exact probability for a group is its weight / the sum of all weights
// two groups with the same weight will be assigned roughly the same number of users

// the value is sent into the react code in response to useTestValue(name)
// the type doesn't matter, so it can a set of flags, alternate text, etc

// changing a group's weight won't affect people who've already been assigned
// if you want to do a rolling release it'll take some extra finagling

const tests = {
  'Just-A-Test': {
    niceone: { weight: 0.5, value: 'nice one!' },
    goodjob: { weight: 0.5, value: 'good job!' },
    toobad: { weight: 4, value: 'too bad' },
  },
};

module.exports = { COOKIE_NAME, tests };
