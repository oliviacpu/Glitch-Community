import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-optimistic-text';

//todo change onchange to async update
const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticOnChange, optimisticError, promisedAsyncResult] = useOptimisticText(value, onChange);
  console.log("inside optimistic markdownInput", promisedAsyncResult)
  const [state, setState] = React.useState({ status: "loaded", lastSavedResponse: undefined, inputState: undefined });
  
  React.useEffect(() => {
    console.log("use effect is running ", promisedAsyncResult)
    if (promisedAsyncResult) {
      console.log("wow you got a promissedAsyncResult")
      promisedAsyncResult.then(something => {
        console.log("good lord", something)
      })
      
    }
  }, [optimisticValue, promisedAsyncResult]) //when do you run??
  
  // value before blur = untrimmed value
  // value after blur = last valid value, untrimmed doesn't matter
  // <MarkdownInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />
  return <MarkdownInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
