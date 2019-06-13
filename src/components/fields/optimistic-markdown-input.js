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
          setState({ lastSavedResponse: change })
        } else {
          
        }
      });
    }
  }
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(value, onChangeWithSavedGoodResponse);
  
  const onBlur = () => {
    if (state.status === "loading") {
      onBlur()
    } else {
      setState({ inputState: state.lastSavedResponse })
    }
  }
  
  
  return <MarkdownInput {...props} value={state.inputState} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
