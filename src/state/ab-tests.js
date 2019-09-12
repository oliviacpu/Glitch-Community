import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

import { COOKIE_NAME, tests } from 'Shared/ab-tests';

const Context = createContext();

const AbTestProvider = ({ AB_TESTS, children }) => {
  const [assignments, setAssignments] = useState(AB_TESTS);
  return <Context.Provider value={assignments}>{children}</Context.Provider>;
};
AbTestProvider.propTypes = {
  AB_TESTS: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const useTestAssignments = () => {
  const { AB_TESTS } = useGlobals();
  const setAssignment = (name, group) => {
    document.cookie = `${COOKIE_NAME}=${JSON.stringify({ ...AB_TESTS, [name]: group })}`;
    window.location.reload();
  };
  return [AB_TESTS, setAssignment];
};

const useTestValue = (name) => {
  const [assignments] = useTestAssignments();
  return tests[name][assignments[name]].value;
};

export default useTestValue;
