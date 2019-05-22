import useOptimisticValue from './use-optimistic-value';

const useOptimisticText = (realValue, setRealValueAsync) => {
  return useOptimisticValue(realValue, (newValue) => setRealValueAsync(newValue.trim()))
};

export default useOptimisticText;
