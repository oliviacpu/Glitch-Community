import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';

export default function FeaturedProjectOptionsPop({ unfeatureProject, createNote, hasNote }) {
  function toggleAndUnfeature(togglePopover) {
    togglePopover();
    unfeatureProject();
  }

  function toggleAndCreateNote(togglePopover) {
    togglePopover();
    createNote();
  }

  return (
    <PopoverMenu>
      {({ togglePopover }) => (
        <PopoverDialog align="right" focusOnPopover>
          <PopoverActions>
            {!hasNote && createNote && <PopoverMenuButton onClick={() => toggleAndCreateNote(togglePopover)} label="Add note" emoji="spiral_note_pad" />}
            <PopoverButton onClick={() => toggleAndUnfeature(togglePopover)} text="Un-feature" emoji="arrow-down" />
          </PopoverActions>
        </PopoverDialog>
      )}
    </PopoverMenu>
  );
}

FeaturedProjectOptionsPop.propTypes = {
  unfeatureProject: PropTypes.func.isRequired,
  createNote: PropTypes.func,
  hasNote: PropTypes.bool,
};

FeaturedProjectOptionsPop.defaultProps = {
  createNote: null,
  hasNote: false,
};
