import React from 'react';
import PropTypes from 'prop-types';
import PopoverWithButton from './popover-with-button';
import PopoverButton from './popover-button';
import { useCurrentUser } from '../../state/current-user';

// Collection Options Pop
const CollectionOptionsPop = (props) => {
  function animate(event, className, func) {
    const collectionContainer = event.target.closest('li');
    collectionContainer.addEventListener('animationend', func, { once: true });
    collectionContainer.classList.add(className);
  }

  function animateThenDeleteCollection(event) {
    if (!window.confirm('Are you sure you want to delete your collection?')) {
      return;
    }
    animate(event, 'slide-down', () => props.deleteCollection(props.collection.id));
  }

  return (
    <dialog className="pop-over collection-options-pop">
      <section className="pop-over-actions danger-zone last-section">
        {props.deleteCollection && <PopoverButton onClick={animateThenDeleteCollection} text="Delete Collection " emoji="bomb" />}
      </section>
    </dialog>
  );
};

CollectionOptionsPop.propTypes = {
  deleteCollection: PropTypes.func,
};

CollectionOptionsPop.defaultProps = {
  deleteCollection: null,
};

// Collection Options Container
export default function CollectionOptions({ deleteCollection, collection }) {
  if (!deleteCollection) {
    return null;
  }

  return (
    <PopoverWithButton
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="collection-options-pop-btn"
      buttonClass="collection-options button-borderless"
    >
      <CollectionOptionsPop collection={collection} deleteCollection={deleteCollection} />
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
