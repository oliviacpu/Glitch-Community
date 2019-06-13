import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-optimistic-text';

//todo change onchange to async update
const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [state, setState] = React.useState({ status: "loaded", lastSavedResponse: undefined, inputState: value });
  const onChangeWithSavedGoodResponse = (change) => {
    setState({ status: "loading" });
    if (onChange) {
      return onChange(change).then(({status}) => {
        if (status === 200) {
          setState({ status: "loaded", lastSavedResponse: change })
        } else {
          setState({ status: "error", inputState: state.lastSavedResponse })
        }
      }, (error) => {
        setState({ status: "error", inputState: state.lastSavedResponse })
      });
    }
  }
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(state.inputState, onChangeWithSavedGoodResponse);
  
  const onBlur = () => {
    if (state.status === "loading") {
      onBlur()
    } else {
      setState({ inputState: state.lastSavedResponse })
    }
  }
  
  
  return <MarkdownInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
