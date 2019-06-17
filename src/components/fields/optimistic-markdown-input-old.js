import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-';

const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [state, setState] = React.useState({ isLoading: false, lastSavedResponse: value, inputState: value, error: null });

  const onChangeWithSavedGoodResponse = (change) => {
    setState({ isLoading: true });
    if (onChange) {
      return onChange(change).then(({status}) => {
        if (status === 200) {
          setState({ isLoading: false, lastSavedResponse: change, inputState: change })
        } else {
          setState({ ...state, isLoading: false })
        }
      }, (error) => {
        setState({ ...state, isLoading: false })
        throw error
      });
    }
  }
  
  const onBlur = () => {
    if (state.isLoading) {
      onBlur();
    } else {
      setState({ ...state, inputState: state.lastSavedResponse, error: null })
    }
  }
  
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(state.inputState, onChangeWithSavedGoodResponse);
  
  React.useEffect(() => {
    setState({ ...state, inputState: optimisticValue, error: optimisticError})
  }, [optimisticValue, optimisticError])
  console.log({ optimisticValue, optimisticError, ...state })
  
  return <MarkdownInput {...props} value={state.inputState} error={state.error} onChange={optimisticOnChange} onBlur={onBlur} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
