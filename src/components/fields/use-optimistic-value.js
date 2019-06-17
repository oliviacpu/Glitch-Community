import React from 'react';

import useDebouncedValue from 'Hooks/use-debounced-value';

/*
use optimistic value: 

- takes in an initial value for the input
- takes in a way to update the server

as users type (on change):
- we ping the server with a trimmed version of the text
- we display an untrimmed version
- if the server hits an error:
  - we display that error to the user
  - we continue to show what the user was typing even though it's not saved
- if the server succeeds:
  - we store that response for the future
  - we pass along the response so that it can be stored in top level state later and passed back in again as props as the inital value

on blur:
- if the user was in an errored state:
  - we show the last saved good state and remove the error

*/

export default function useOptimisticValue(value, onChange, onBlur) {
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null, lastSaved: value, shouldShowLastSaved: false});
  
  // as the user types we save that as state.value
  const optimisticOnChange = (newValue) => {
    setState((prevState) => ({ ...prevState, value: newValue, shouldShowLastSaved: false, error: null }));
  };
  
  // show what's passed in, or whatever was last typed since that point, if we are in an error state after a blur show the last saved state
  const optimisticValue = state.shouldShowLastSaved ? state.lastSaved : (state.value === undefined ? value : state.value);
  
  const debouncedValue = useDebouncedValue(state.value, 500);
  
  React.useEffect(() => {
    const ifUserHasTypedSinceLastSave = debouncedValue !== undefined;
    
    if (ifUserHasTypedSinceLastSave) {
      
      // if the value changes during the async action then ignore the result
      const setStateIfStillRelevant = (newState) => {
        setState((prevState) => {
          return prevState.value === debouncedValue ? newState : prevState
        });
      };
  
      // this scope can't be async/await because it's an effect
      onChange(debouncedValue).then(
        () => {
          setStateIfStillRelevant({ value: undefined, error: null, lastSaved: debouncedValue, shouldShowLastSaved: false, });
          return debouncedValue;
        },
        (error) => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "Sorry, we had trouble saving. Try again later?";
          setStateIfStillRelevant({ ...state, value: debouncedValue, error: message, shouldShowLastSaved: false });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticOnBlur = () => {
    const shouldShowLastSaved = !!state.error
    setState({ ...state, shouldShowLastSaved, error: null });
    if (onBlur) { 
      onBlur();
    }
  }

  return [optimisticValue, optimisticOnChange, optimisticOnBlur, state.error];
}
