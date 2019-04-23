import React from 'react';
import PropTypes from 'prop-types';

import TextArea from './text-area';
import Markdown from '../text/markdown';

const MarkdownInput = ({ error, onChange, placeholder, value }) => {
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  if (error || focused) {
    return (
      <TextArea
        error={error}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        value={value}
      />
    );
  }
  return (
    <p
      aria-label={placeholder}
      onFocus={onFocus}
      placeholder={placeholder}
      role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
    >
      <Markdown>{value}</Markdown>
    </p>
  );
};

MarkdownInput.propTypes = {
};

export default MarkdownInput;
