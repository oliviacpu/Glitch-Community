import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const CollectionNameInput = ({ name, onChange }) => (
  <OptimisticTextInput
    labelText="Collection Name"
    value={name}
    onChange={onChange}
    placeholder="Name your collection"
  />
);

CollectionNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CollectionNameInput;
