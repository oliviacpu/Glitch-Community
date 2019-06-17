import { useState } from 'react';
import useOptimisticValue from './use-optimistic-value';

// always show untrimmed version to user, always send out trimmed version to server
function usePassivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };
  
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};
