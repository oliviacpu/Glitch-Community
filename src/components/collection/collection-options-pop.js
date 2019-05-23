import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverMenuButton, PopoverDialog, PopoverActions } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';

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
            <Button onClick={deleteCollection} size="small" type="dangerZone">
              Delete Collection <Emoji name="bomb" />
            </Button>
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
