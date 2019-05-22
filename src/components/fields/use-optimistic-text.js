import { useState } from 'react';
import useOptimisticValue from './use-optimistic-value';

const useOptimisticText = (realValue, setRealValueAsync) => {
  const [optimisticValue, setOptimisticValue, errorMessage] = useOptimisticValue(realValue, setRealValueAsync);
  const [inputValue, setInputValue] = useState(realValue);

  const trimmedValue = optimisticValue === inputValue.trim() ? inputValue : optimisticValue;
  const setTrimmedValue = (value) => {
    setInputValue(value);
    setOptimisticValue(value.trim());
  };
  return [trimmedValue, setTrimmedValue, errorMessage];
};

export default useOptimisticText;
