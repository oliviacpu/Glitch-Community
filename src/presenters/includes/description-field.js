import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import MarkdownInput from 'Components/inputs/markdown-input';
import { OptimisticValue } from './field-helpers';

const EditableDescription = ({ description, placeholder, update, onBlur, allowImages }) => (
  <OptimisticValue value={description} update={update}>
    {({ optimisticValue, optimisticUpdate }) => (
      <MarkdownInput
        value={optimisticValue}
        onChange={optimisticUpdate}
        onBlur={onBlur}
        placeholder={placeholder}
        allowImages={allowImages}
      />
    )}
  </OptimisticValue>
);
EditableDescription.propTypes = {
  allowImages: PropTypes.bool,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};
EditableDescription.defaultProps = {
  allowImages: true,
  placeholder: '',
  onBlur: () => {},
};

export const AuthDescription = ({ authorized, description, placeholder, update, onBlur, maxLength, allowImages }) =>
  authorized ? (
    <EditableDescription
      description={description}
      update={update}
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      allowImages={allowImages}
    />
  ) : (
    description && (
      <p className="description read-only">
        <Markdown allowImages={allowImages}>{description}</Markdown>
      </p>
    )
  );

AuthDescription.propTypes = {
  allowImages: PropTypes.bool,
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func,
};

AuthDescription.defaultProps = {
  allowImages: true,
  placeholder: '',
  update: null,
};
