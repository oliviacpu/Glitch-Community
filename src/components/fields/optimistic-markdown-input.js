import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-optimistic-text';

//todo change onchange to async update
const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(value, onChange);
  const [state, setState] = React.useState({ status: "loaded", lastSavedResponse: undefined, inputState: undefined });
  
  const onBlur = () => {
    if (state.status === "loading") {
      onBlur()
    } else {
      setState({ inputState: state.lastSavedResponse })
    }
  }
  
  const onChangeWithSavedGoodResponse = (change) => {
    optimisticOnChange(change).then(something => console.log({something}))
  }
  
  return <MarkdownInput {...props} value={state.inputState} error={optimisticError} onChange={onChangeWithSavedGoodResponse} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
