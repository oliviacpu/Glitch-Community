import React from 'react';
import PropTypes from 'prop-types';

import AddProjectToCollectionPop from '../pop-overs/add-project-to-collection-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';

const AddProjectToCollection = ({ project, ...props }) => (
  <PopoverWithButton
    buttonClass="button-small has-emoji add-project"
    buttonText={
      <>
        Add to Collection <span className="emoji framed-picture" role="presentation" />
      </>
    }
  >
    {({ togglePopover, focusFirstElement }) => (
      <AddProjectToCollectionPop {...props} project={project} togglePopover={togglePopover} focusFirstElement={focusFirstElement} />
    )}
  </PopoverWithButton>
);

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
