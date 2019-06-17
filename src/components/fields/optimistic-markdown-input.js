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

const OptmisticMarkdownInput = ({ value, onChange, ...props }) => {
  const {
    inputValue, wrappedOnChange, error, wrappedOnBlur,
  } = useOptimistValueOnChangeAndBlur({ value, asyncUpdate: onChange });
  
  return <MarkdownInput {...props} value={inputValue} onChange={wrappedOnChange} error={error} onBlur={wrappedOnBlur} />;
};

OptmisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default OptmisticMarkdownInput;


function useOptimistValueOnChangeAndBlur({ value, asyncUpdate }) {
  const [nonAggressivelyTrimmedInputValue, onChangeWrappedWithTrimmedValue] = useNonAggressivelyTrimmedInputs(value, asyncUpdate);
  const [inputValue, wrappedOnChange, wrappedOnBlur, error] = useRevertOnBlurWhenError(nonAggressivelyTrimmedInputValue, onChangeWrappedWithTrimmedValue);
  const [optimisticValue, optimisticOnChange] = useOptimisticValueAndDebounceCallsToServer(inputValue, wrappedOnChange);

  console.log({ inputValue, optimisticValue, error })
  return {
    inputValue, wrappedOnChange: optimisticOnChange, wrappedOnBlur, error,
  };
}

function useNonAggressivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = React.useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};

function useRevertOnBlurWhenError(value, asyncUpdate, onBlur) {
  const [state, setState] = React.useState({ 
    isLoading: false, 
    lastSavedResponse: value, 
    inputValue: value,
    error: null,
  });

  const wrappedOnChange = (change) => {
    setState({ ...state, isLoading: true });
    if (asyncUpdate) {
      return asyncUpdate(change)
        .then(response => {
          if (response.status === 200) {
            setState({ ...state, isLoading: false, lastSavedResponse: change, inputValue: change });
          } else {
            setState({ ...state, isLoading: false, });
          }
        }).catch(error => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "Sorry! Something went wrong, try again later?"; 
          setState({ ...state, isLoading: true, error: message });
          throw error; // rethrow error so other funcs can use it later if necessary
        });
    }
  }
  
  const wrappedOnBlur = () => {
    // if we're still waiting for a response from the server, keep running this func
    if (state.status === "loading") {
      wrappedOnBlur();
    } else {
      setState({ ...state, inputValue: state.lastSavedResponse, error: null });
      if (onBlur) { onBlur(); }
    }
  }
  
  React.useEffect(() => {
    setState({ ...state, inputValue: value })
  }, [value]);
  
  return [state.inputValue || value, wrappedOnChange, wrappedOnBlur];
}


/*
  What this does:
  - limit server calls to everytime state changes and it's been at least 500 ms
  - but shows whatever the latest is as you type even if it hasn't saved yet
  - returns an error message to be displayed to the user in case of error
*/


function useOptimisticValueAndDebounceCallsToServer(rawValueFromOnChange, setValueAsync) {
  // store what is being typed in, along with an error message
  // update undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ updateToSave: undefined });
  
  // save a debounced version of what's being typed in
  const debouncedUpdateToSave = useDebouncedValue(state.updateToSave, 500);
  
  const wrapOnChange = async (change) => {
    console.log({ change })
    //save what's being typed in
    setState({ ...state, updateToSave: change });
    console.log(state)
    const textHasUpdatedSinceSave = debouncedUpdateToSave !== undefined;
    console.log({ textHasUpdatedSinceSave, debouncedUpdateToSave })
    if (textHasUpdatedSinceSave) {
      // if the updateToSave changes during the async action then ignore the result
      const setStateIfLastServerCallIsStillRelevant = (newState) => {
        if (state.updateToSave === debouncedUpdateToSave) {
          setState(newState);
        }
      };
      
      try {
        const response = await setValueAsync(debouncedUpdateToSave)
        if (response) {
          console.log("saved!")
          setStateIfLastServerCallIsStillRelevant({ updateToSave: undefined })
          return response // rethrow response in case we want to keep wrapping
        }
      } catch (error) {
        console.log("inside error", debouncedUpdateToSave)
        setStateIfLastServerCallIsStillRelevant({ updateToSave: debouncedUpdateToSave });
        throw error // rethrow error in case we want to keep wrapping
      }
    }
  }

  const optimisticValue = state.updateToSave !== undefined ? state.updateToSave : rawValueFromOnChange;
  

  return [optimisticValue, wrapOnChange];
};


// function useOptimisticValueAndDebounceCallsToServerOLLLLLd(rawValueFromOnChange, setValueAsync) {
//   // store what is being typed in, along with an error message
//   // update undefined means that the field is unchanged from the 'real' value
//   const [state, setState] = React.useState({ updateToSave: undefined, error: null });
//   const debouncedUpdateToSave = useDebouncedValue(state.updateToSave, 500);
  
//   React.useEffect(() => {
//     const textHasUpdatedSinceSave = debouncedUpdateToSave !== undefined;
//     if (textHasUpdatedSinceSave) {
//       // if the updateToSave changes during the async action then ignore the result
//       const setStateIfLastServerCallIsStillRelevant = (newState) => {
//         setState((prevState) => {
//           console.log(prevState, debouncedUpdateToSave, newState)
//           return prevState.updateToSave === debouncedUpdateToSave ? newState : prevState 
//         })
//       };
//       // this scope can't be async/await because it's an effect
//       setValueAsync(debouncedUpdateToSave).then(
//         (response) => {
//           console.log("saved!")
//           setStateIfLastServerCallIsStillRelevant({ updateToSave: undefined, error: null })
//           return response
//         },
//         (error) => {
//           console.log("hit an error")
//           const message = (error && error.response && error.response.data && error.response.data.message) || "Sorry! Something went wrong, try again later?"; 
//           console.log({ message })
//           setStateIfLastServerCallIsStillRelevant({ updateToSave: debouncedUpdateToSave, error: message });
//         },
//       );
//     }
//   }, [debouncedUpdateToSave]);

//   const optimisticValue = state.updateToSave !== undefined ? state.updateToSave : rawValueFromOnChange;
  
//   const setOptimisticValue = (newValue) => {
//     setState((prevState) => ({ ...prevState, updateToSave: newValue }));
//   };
//   return [optimisticValue, setOptimisticValue, state.error];
// };

