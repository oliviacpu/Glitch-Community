import { useState } from 'react';
import useOptimisticValue from './use-optimistic-value';

const useOptimisticText = (realValue, setRealValueAsync) => {
  const [inputValue, setInputValue] = useState({ trimmed: realValue, input: realValue });
  const [optimisticValue, errorMessage, setOptimisticValue] = useOptimisticValue(realValue, setRealValueAsync);

  const inputValue = optimisticValue === trimmed ? input : optimisticValue;
  const setInputValue = (value) => {
    setValue({ trimmed: value.trim(), input: value });
    setOptimisticValue(value.trim());
  };
  return [inputValue, errorMessage, setInputValue];
};

export default useOptimisticText;
