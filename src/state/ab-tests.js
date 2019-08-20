import { useGlobals } from 'State/globals';

const useTest = (name) => {
  const { AB_TESTS } = useGlobals();
  return AB_TESTS[name];
};

const resetTests = () => {
  document.cookie = `ab-tests=; expires=${new Date()}`;
};

export default useTest;
export { resetTests };
