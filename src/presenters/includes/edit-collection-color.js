import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';

const EditCollectionColor = ({ update, initialColor, ...props }) => (
  <PopoverWithButton containerClass="edit-collection-color-btn" buttonClass="add-project" buttonText="Color">
    {({ togglePopover, focusFirstElement }) => (
      <EditCollectionColorPop {...props} updateColor={update} initialColor={initialColor} togglePopover={togglePopover} focusFirstElement={focusFirstElement} />
    )}
  </PopoverWithButton>
);

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};
