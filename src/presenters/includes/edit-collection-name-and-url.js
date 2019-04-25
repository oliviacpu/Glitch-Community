import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';

import WrappingTextInput from 'Components/inputs/wrapping-text-input';
import { OptimisticValue, TrimmedValue } from './field-helpers';

// This recreates EditableField but OptimisticValue tracks both the name and url
// That way the url preview updates in real time as you type into the name field

const EditCollectionNameAndUrl = ({ name, url, update, isAuthorized }) => {
  const placeholder = 'Name your collection';
  return (
    <OptimisticValue value={{ name, url }} update={update} resetOnError={false}>
      {({ optimisticValue, optimisticUpdate, error }) => (
        <TrimmedValue value={optimisticValue.name} update={(newName) => optimisticUpdate({ name: newName, url: kebabCase(newName) })}>
          {({ value: trimmedValue, update: trimmedUpdate }) => (
            <h1 className="collection-name">
              {isAuthorized ? (
                <WrappingTextInput value={trimmedValue} onChange={trimmedUpdate} placeholder={placeholder} error={error} />
              ) : (
                name
              )}
            </h1>
          )}
        </TrimmedValue>
      )}
    </OptimisticValue>
  );
};
EditCollectionNameAndUrl.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default EditCollectionNameAndUrl;
