import React from 'react';
import PropTypes from 'prop-types';

import useDebouncedValue from 'Hooks/use-debounced-value';

import MarkdownInput from '../inputs/markdown-input';


/*

- takes in an initial state value 
- takes in a way to update the server

as users type (on change):
- we ping the server with a trimmed version of the text
- we display an untrimmed version

if the server hits an error:
- we display that error to the user
- we continue to let the user type as normal

on blur:
- we revert the input back to the last successfully saved response
- we hide the error

*/


function OptimisticMarkdownInput({ value, onChange, ...props }) {
  const [untrimmedDisplayValue, wrapOnChangeWithTrimmedInputs] = useNonAggressivelyTrimmedInputs(value, onChange);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, error] = useOptimisticValue(untrimmedDisplayValue, wrapOnChangeWithTrimmedInputs);
  
  return <MarkdownInput {...props} value={optimisticValue} onChange={optimisticOnChange} onBlur={optimisticOnBlur} error={error} />;
}
OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default OptimisticMarkdownInput;


function useNonAggressivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = React.useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };
  
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};

function useOptimisticValue(value, onChange) { //todo add onblur
  console.log("start", { value })
  // store what is being typed in, along with an error message
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null, lastSaved: value, useLastSaved: false});

  // debounce our stored value and send the async updates when it is not undefined
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      // if the value changes during the async action then ignore the result
      const setStateIfStillRelevant = (newState) => {
        setState((prevState) => {
          return prevState.value === debouncedValue ? newState : prevState
        });
      };
  
      // this scope can't be async/await because it's an effect
      onChange(debouncedValue).then(
        () => {
          console.log("saved!!")
          setStateIfStillRelevant({ value: undefined, error: null, lastSaved: debouncedValue, useLastSaved: false, });
          return debouncedValue
        },
        (error) => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "Sorry, we had trouble saving. Try again later?";
          setStateIfStillRelevant({ ...state, value: debouncedValue, error: message, useLastSaved: false });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticOnBlur = () => {
    const useLastSaved = !!state.error
    setState({ ...state, useLastSaved, error: null });
    // if (onBlur) { onBlur(); }
  }
  
  const optimisticOnChange = (newValue) => {
    console.log("optimisticOnChange new value", newValue)
    setState((prevState) => ({ ...prevState, value: newValue, useLastSaved: false, error: null }));
  };
  
  const optimisticValue = state.useLastSaved ? state.lastSaved : (state.value === undefined ? value : state.value);
  console.log("WHAT IS STATE LOL", {...state})
  console.log("What is optimistic value now?", optimisticValue, "because of state.value is", state.value, "and value is", value)
  return [optimisticValue, optimisticOnChange, optimisticOnBlur, state.error];
}

