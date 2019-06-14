import React from 'react';
import PropTypes from 'prop-types';

import useOptimisticText from './use-optimistic-text';

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

const OptimisticWrapper = ({ passedStateValue, asyncUpdate, ...props }) => {
  const [state, setState] = React.useState({ status: "loaded", lastSavedResponse: value, inputState: value });

  const onChangeWithSavedGoodResponse = (change) => {
    setState({ status: "loading" });
    if (onChange) {
      return onChange(change).then(({status}) => {
        console.log("first success", status)
        if (status === 200) {
          setState({ status: "loaded", lastSavedResponse: change, inputState: change })
        } else {
          setState({ ...state, status: "error" })
        }
      }, (error) => {
        setState({ ...state, status: "error" })
        throw error
      });
    }
  }
  const onBlur = () => {
    if (state.status === "loading") {
      onBlur()
    } else {
      console.log("in the blur", state)
      setState({ ...state, inputState: state.lastSavedResponse })
    }
  }
  
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(state.inputState, onChangeWithSavedGoodResponse);
  
  React.useEffect(() => {
    console.log("setting inputState as optimisticValue", optimisticValue)
    setState({ ...state, inputState: optimisticValue })
  }, [optimisticValue])
  
  
  return <MarkdownInput {...props} value={state.inputState} error={optimisticError} onChange={optimisticOnChange} onBlur={onBlur} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
