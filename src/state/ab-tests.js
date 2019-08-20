import { useGlobals } from 'State/globals';

const useABTest = (name) => {
  const { AB_TESTS } = useGlobals();
  return AB_TESTS[name];
};

const resetGroups = () => {
  document.cookie = `ab-tests=; expires=${new Date()}`;
}

export default useABTest;
