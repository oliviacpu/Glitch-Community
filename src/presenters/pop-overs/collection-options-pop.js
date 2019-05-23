import React from 'react';
import PropTypes from 'prop-types';
import { PopoverWithButton, PopoverDialog, PopoverActions } from 'Components/popover';
import Button from 'Components/buttons/button';
import { useCurrentUser } from 'State/current-user';

const CollectionOptionsPop = ({ deleteCollection }) => (
  <PopoverDialog focusOnDialog>
    <PopoverActions>
      <Button onClick={deleteCollection} size="small" type="dangerZone">
        Delete Collection <Emoji name="bomb" />
      </Button>
    </PopoverActions>
  </PopoverDialog>
);

CollectionOptionsPop.propTypes = {
  deleteCollection: PropTypes.func.isRequired,
};

const PopoverMenu = ({ children }) => (
  <PopoverWithButton
    buttonText={<div className="down-arrow" aria-label="options" />}
    containerClass="collection-options-pop-btn"
    buttonClass="collection-options button-borderless"
  >
    {children}
  </PopoverWithButton>
);

// Collection Options Container
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

  return <PopoverMenu>{() => <CollectionOptionsPop deleteCollection={confirmThenDelete} />}</PopoverMenu>;
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
