import React from 'react';

import useDebouncedValue from 'Hooks/use-debounced-value';

/*

Use Optimistic Value:

- takes in an initial value for the input (this representes the real value the server last gave us)
- takes in a way to update the server

as users type (on change):
- we show them what they are typing, assuming it has been saved properly
- if the server hits an error:
  - we display that error to the user
  - and we continue to show what the user was typing even though it's not saved
- if the server succeeds:
  - we pass along the response so that it can be stored in top level state later and passed back in again as props as the inital "real" value

on blur:
- if the user was in an errored state:
  - we show the last saved good state and remove the error

*/

export default function useOptimisticValue(realValue, onChange, onBlur) {
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null });

  // as the user types we save that as state.value, later as the user saves, we reset the state.value to undefined and instead show whatever value is passed in
  const optimisticOnChange = (newValue) => {
    setState((prevState) => ({ ...prevState, value: newValue, error: null }));
  };

  // always show what the server knows, unless the user is currently typing something or we're loading an in-flight request
  let optimisticValue = realValue;
  if (state.value !== undefined) {
    optimisticValue = state.value;
  }

  const debouncedValue = useDebouncedValue(state.value, 500);

  React.useEffect(() => {
    const ifUserHasTypedSinceLastSave = debouncedValue !== undefined;

    if (ifUserHasTypedSinceLastSave) {
      // if the value changes during the async action then ignore the result
      const setStateIfStillRelevant = (newState) => setState((prevState) => (prevState.value === debouncedValue ? newState : prevState));

      // this scope can't be async/await because it's an effect
      onChange(debouncedValue).then(
        () => {
          setStateIfStillRelevant({ value: undefined, error: null });
          return debouncedValue;
        },
        (error) => {
          const message =
            (error && error.response && error.response.data && error.response.data.message) || 'Sorry, we had trouble saving. Try again later?';
          setStateIfStillRelevant({ ...state, value: debouncedValue, error: message });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticOnBlur = () => {
    if (!!state.error) {
      setState({ ...state, error: null, value: undefined }); //reverts input value to last server response
    }
    if (onBlur) {
      onBlur();
    }
  };

  return [optimisticValue, optimisticOnChange, optimisticOnBlur, state.error];
}
