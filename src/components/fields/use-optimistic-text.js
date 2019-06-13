import { useState } from 'react';
import useOptimisticValue from './use-optimistic-value';

/*
  what this does:
  - ensures we don't update input with trimmed value (so spaces don't disappear when typing)
  - 
*/

const useOptimisticText = (realValue, setRealValueAsync) => {
  const [optimisticValue, setOptimisticValue, errorMessage] = useOptimisticValue(realValue, setRealValueAsync);
  const [untrimmedValue, setUntrimmedValue] = useState(realValue);

  const inputValue = optimisticValue === untrimmedValue.trim() ? untrimmedValue : optimisticValue;
  const setInputValue = (value) => {
    setUntrimmedValue(value);
    setOptimisticValue(value.trim());
  };
  return [inputValue, setInputValue, errorMessage];
};

export default useOptimisticText;
