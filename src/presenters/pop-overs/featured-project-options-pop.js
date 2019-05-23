import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';

export default function FeaturedProjectOptionsPop({ unfeatureProject, addNote, hasNote }) {
  function toggleAndUnfeature(togglePopover) {
    // featuredProjectRef.current.classList.add('slide-down');
    // featuredProjectRef.current.addEventListener('animationend', () => {
    togglePopover();
    unfeatureProject();
    // });
  }

  function toggleAndDisplayNewNote(togglePopover) {
    togglePopover();
    addNote();
  }

  return (
    <PopoverMenu>
      {({ togglePopover }) => (
        <PopoverDialog align="right" focusOnPopover>
          <PopoverActions>
            {!hasNote && addNote && <PopoverMenuButton onClick={toggleAndDisplayNewNote(togglePopover)} label="Add note" emoji="spiral_note_pad" />}
            <PopoverButton onClick={() => toggleAndUnfeature(togglePopover)} text="Un-feature" emoji="arrow-down" />
          </PopoverActions>
        </PopoverDialog>
      )}
    </PopoverMenu>
  );
}

FeaturedProjectOptionsPop.propTypes = {
  unfeatureProject: PropTypes.func.isRequired,
  addNote: PropTypes.func,
  hasNote: PropTypes.bool,
};

FeaturedProjectOptionsPop.defaultProps = {
  addNote: null,
  hasNote: false,
};
