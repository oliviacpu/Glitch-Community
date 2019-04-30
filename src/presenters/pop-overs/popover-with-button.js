import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';

const PopoverWithButton = ({ dataTrack, containerClass, buttonClass, buttonText, children: renderChildren, onOpen }) => (
  <PopoverContainer onOpen={onOpen}>
    {({ visible, togglePopover, focusDialog }) => (
      <div className={`button-wrap ${containerClass}`}>
        <button className={buttonClass} data-track={dataTrack} onClick={togglePopover} type="button">
          {buttonText}
        </button>
        {visible && renderChildren({ togglePopover, focusDialog })}
      </div>
    )}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};

PopoverWithButton.defaultProps = {
  buttonClass: '',
  containerClass: '',
  dataTrack: '',
  onOpen: null,
};

export default PopoverWithButton;
