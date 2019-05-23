import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverMenuButton, PopoverDialog, PopoverActions } from 'Components/popover';

export default function CollectionOptions({ deleteCollection, collection }) {
  if (!deleteCollection) {
    return null;
  }
  function confirmThenDelete() {
    if (!window.confirm('Are you sure you want to delete your collection?')) {
      return;
    }
    deleteCollection(collection.id);
  }

  return (
    <PopoverMenu>
      {() => (
        <PopoverDialog focusOnDialog align="right">
          <PopoverActions type="dangerZone">
            <PopoverMenuButton onClick={confirmThenDelete} label="Delete Collection" emoji="bomb" />
          </PopoverActions>
        </PopoverDialog>
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
