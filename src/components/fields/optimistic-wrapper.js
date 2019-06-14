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





import useDebouncedValue from 'Hooks/use-debounced-value';

/*
  What this does:
  - limit server calls to everytime state changes and it's been at least 500 ms AKA the debouncer
*/

const useOptimisticValue = (realValue, setValueAsync) => {
  // store what is being typed in, along with an error message
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null });
  // debounce our stored value and send the async updates when it is not undefined
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      // if the value changes during the async action then ignore the result
      const setStateIfMatches = (newState) => {
        setState((prevState) => {
          if (prevState.value === debouncedValue) {
            console.log("Setting state because it matches the debounced value setting state to", newState)
          }
          return prevState.value === debouncedValue ? newState : prevState
        });
      };
      // this scope can't be async/await because it's an effect
      setValueAsync(debouncedValue).then(
        () => {
          return setStateIfMatches({ value: undefined, error: null })
        },
        (error) => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "test";
          setStateIfMatches({ value: debouncedValue, error: message });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticValue = state.value !== undefined ? state.value : realValue;
  
  const setOptimisticValue = (newValue) => {
    setState((prevState) => ({ ...prevState, value: newValue }));
  };
  return [optimisticValue, setOptimisticValue, state.error];
};

