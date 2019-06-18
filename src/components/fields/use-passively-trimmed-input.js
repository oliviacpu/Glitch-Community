import { useState } from 'react';

// always show untrimmed version to user, always send out trimmed version to server, onBlur show what was sent to the server
export default function usePassivelyTrimmedInput(rawInput, asyncUpdate, onBlur) {
  const [untrimmedValue, setUntrimmedValue] = useState(rawInput);

  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;

  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };

  const wrapOnBlur = () => {
    setUntrimmedValue(rawInput.trim());
    if (onBlur) {
      onBlur();
    }
  };

  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue, wrapOnBlur];
}
