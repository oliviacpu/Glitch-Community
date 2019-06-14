import React from 'react';
import PropTypes from 'prop-types';
import useDebouncedValue from 'Hooks/use-debounced-value';

// import useOptimisticText from './use-optimistic-text';


function useNonAggressivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = React.useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    asyncUpdate(value.trim());
  };
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};

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

const OptimisticWrapper = ({ value, asyncUpdate, ...props }) => {
  const [state, setState] = React.useState({ 
    status: null, 
    lastSavedResponse: value, 
    inputValue: value 
  });

  const onChange = async (change) => {
    setState({ status: "loading" });
    if (asyncUpdate) {
      try {
        const response = await asyncUpdate(change);
        if (response.status === 200) {
          setState({ status: "loaded", lastSavedResponse: change, inputState: change });
        } else {
          setState({ ...state, status: "error" });
        }
        return response // return response so other funcs can use it later if necessary
      } catch (error) {
        setState({ ...state, status: "error" });
        throw error; // rethrow error so other funcs can use it later if necessary
      }
    }
  }
  
  const onBlur = () => {
    // if we're still waiting for a response from the server, keep running this func
    if (state.status === "loading") {
      onBlur();
    } else {
      setState({ ...state, inputState: state.lastSavedResponse })
    }
  }
  
  const [nonAggressivelyTrimmedInputValue, onChangeWrappedWithTrimmedValue] = useNonAggressivelyTrimmedInputs(debouncedValue, onChange)
  
  
//   const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(state.inputState, onChangeWithSavedGoodResponse);
  
//   React.useEffect(() => {
//     setState({ ...state, inputState: optimisticValue })
//   }, [optimisticValue])
  
  
  return <MarkdownInput {...props} value={state.inputState} error={optimisticError} onChange={optimisticOnChange} onBlur={onBlur} />;
};

OptimisticWrapper.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticWrapper;




/*
  What this does:
  - limit server calls to everytime state changes and it's been at least 500 ms AKA the debouncer
*/

const useOptimisticValue = (realValue, setValueAsync) => {
  // store what is being typed in, along with an error message
  // update undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ update: undefined, error: null });
  const debouncedUpdate = useDebouncedValue(state.update, 500);
  
  React.useEffect(() => {
    const textHasUpdated = debouncedUpdate !== undefined
    if (textHasUpdated) {
      // if the update changes during the async action then ignore the result
      const setStateIfMatches = (newState) => setState((prevState) => prevState.update === debouncedUpdate ? newState : prevState );
      // this scope can't be async/await because it's an effect
      setValueAsync(debouncedUpdate).then(
        () => {
          return setStateIfMatches({ update: undefined, error: null })
        },
        (error) => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "test";
          setStateIfMatches({ update: debouncedUpdate, error: message });
        },
      );
    }
  }, [debouncedUpdate]);

  const optimisticValue = state.update !== undefined ? state.update : realValue;
  
  const setOptimisticValue = (newValue) => {
    setState((prevState) => ({ ...prevState, update: newValue }));
  };
  return [optimisticValue, setOptimisticValue, state.error];
};

