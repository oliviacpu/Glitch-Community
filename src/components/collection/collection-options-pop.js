import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <PopoverMenu>
      {() => (
        <DeleteCollection collection={collection} deleteCollection={deleteCollection} />
      )}
    </PopoverMenu>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
