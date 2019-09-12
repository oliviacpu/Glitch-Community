import { COOKIE_NAME, tests } from 'Shared/ab-tests';
import { useGlobals } from 'State/globals';

const useTestAssignments = () => {
  const { AB_TESTS } = useGlobals();
  return AB_TESTS;
};

const useTestValue = (name) => {
  const assignment = useTestAssignments()[name];
  return tests[name][assignment].value;
};

const resetTests = () => {
  document.cookie = `${COOKIE_NAME}=; expires=${new Date()}`;
};

export default useTestValue;
export { resetTests };
