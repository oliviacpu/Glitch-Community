import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';
import PopoverButton from './popover-button';

// Project Options Container
// create as stateful react component
export default function FeaturedProjectOptionsPop({ unfeatureProject, displayNewNote, hasNote, featuredProjectRef, canAddNote }) {
  function animateThenUnfeature(togglePopover) {
    featuredProjectRef.current.classList.add('slide-down');
    featuredProjectRef.current.addEventListener('animationend', () => {
      togglePopover();
      unfeatureProject();
    });
  }

  function toggleAndDisplayNewNote(togglePopover) {
    togglePopover();
    displayNewNote();
  }

  return (
    <PopoverContainer>
      {({ togglePopover, visible }) => (
        <div>
          <button className="project-options button-borderless featured-project-options-pop-btn" onClick={togglePopover}>
            <div className="down-arrow" />
          </button>
          {visible && (
            <dialog className="pop-over project-options-pop featured-project-options-pop">
              <section className="pop-over-actions">
                {!hasNote && canAddNote && (
                  <PopoverButton onClick={() => toggleAndDisplayNewNote(togglePopover)} text="Add note" emoji="spiral_note_pad" />
                )}
                <PopoverButton onClick={() => animateThenUnfeature(togglePopover)} text="Un-feature" emoji="arrow-down" />
              </section>
            </dialog>
          )}
        </div>
      )}
    </PopoverContainer>
  );
}

FeaturedProjectOptionsPop.propTypes = {
  unfeatureProject: PropTypes.func.isRequired,
  displayNewNote: PropTypes.func,
  hasNote: PropTypes.bool,
  canAddNote: PropTypes.bool,
};

FeaturedProjectOptionsPop.defaultProps = {
  displayNewNote: () => {},
  hasNote: false,
  canAddNote: false,
};
