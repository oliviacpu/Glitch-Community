import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverDialog, PopoverActions } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

export default function CollectionOptions({ collection }) {
  return (
    <PopoverMenu>
      {() => (
        <PopoverDialog focusOnDialog align="right">
          <PopoverActions type="dangerZone">
            <DeleteCollection collection={collection} />
          </PopoverActions>
        </PopoverDialog>
      )}
    </PopoverMenu>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
};
