import { useState } from 'react';
import useOptimisticValue from './use-optimistic-value';

/*
  what this does:
  - trims input that we send to the server
  - BUT it returns the untrimmed value so you don't lose spaces as you type
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
