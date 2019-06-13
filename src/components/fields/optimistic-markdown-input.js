import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-optimistic-text';

//todo change onchange to async update
const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [state, setState] = React.useState({ status: "loaded", lastSavedResponse: value, inputState: value });

  const onChangeWithSavedGoodResponse = (change) => {
    setState({ status: "loading" });
    if (onChange) {
      return onChange(change).then(({status}) => {
        console.log("first success", status)
        if (status === 200) {
          setState({ status: "loaded", lastSavedResponse: change, inputState: change })
        } else {
          setState({ ...state, status: "error", inputState: state.lastSavedResponse })
        }
      }, (error) => {
        setState({ ...state, status: "error", inputState: state.lastSavedResponse })
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
  
  const revertState = state.status == "error" ? state.inputState : null; //makes me wonder if we need inputstate in this situation? also state.inputState is a stupid name
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(state.inputState, onChangeWithSavedGoodResponse, revertState);
  
  
  return <MarkdownInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} onBlur={onBlur} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
