import React from 'react';
import PropTypes from 'prop-types';
import PopoverWithButton from './popover-with-button';
import PopoverButton from './popover-button';
import { useCurrentUser } from '../../state/current-user';

// Collection Options Pop
const CollectionOptionsPop = ({ deleteCollection, collection }) => {
  function confirmThenDelete() {
    if (!window.confirm('Are you sure you want to delete your collection?')) {
      return;
    }
    deleteCollection(collection.id);
  }

  return (
    <dialog className="pop-over collection-options-pop" tabIndex="0" ref={props.focusDialog}>
      <section className="pop-over-actions danger-zone last-section">
        {deleteCollection && <PopoverButton onClick={confirmThenDelete} text="Delete Collection " emoji="bomb" />}
      </section>
    </dialog>
  );
};

CollectionOptionsPop.propTypes = {
  deleteCollection: PropTypes.func,
  focusDialog: PropTypes.func.isRequired,
};

CollectionOptionsPop.defaultProps = {
  deleteCollection: null,
};

// Collection Options Container
export default function CollectionOptions({ deleteCollection, collection }) {
  const { currentUser } = useCurrentUser();

  if (!deleteCollection) {
    return null;
  }

  return (
    <PopoverWithButton
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="collection-options-pop-btn"
      buttonClass="collection-options button-borderless"
    >
      {({ focusDialog }) => (
        <CollectionOptionsPop collection={collection} deleteCollection={deleteCollection} currentUser={currentUser} focusDialog={focusDialog} />
      )}
    </PopoverWithButton>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
