import { useState } from 'react';

// always show untrimmed version to user, always send out trimmed version to server
export default function usePassivelyTrimmedInput(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = useState(rawInput);

  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;

  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };

  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
}
