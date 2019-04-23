import React from 'react';
import PropTypes from 'prop-types';

import TextArea from './text-area';
import Markdown from '../text/markdown';

const MarkdownInput = ({ onChange, placeholder, value }) => {
  const [focused, setFocused] = React.useState(false);
  if (focused) {
    return (
      <TextArea
        onBlur={() => setFocused(false)}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    );
  }
  return (
    <p
      placeholder={placeholder}
      aria-label={placeholder}
      role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
      onFocus={() => setFocused(true)}
    >
      <Markdown>{value}</Markdown>
    </p>
  );
};

MarkdownInput.propTypes = {
};

export default MarkdownInput;
