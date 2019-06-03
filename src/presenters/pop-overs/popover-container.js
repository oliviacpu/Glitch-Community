import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {
  const [visible, setVisibleState] = React.useState(startOpen);
  const [openedFromKeyboard, setOpenedFromKeyboard] = React.useState(false);
  console.log("visible", visible)
  const setVisible = (newVisible) => {
    console.log("setVisible being called with", newVisible)
    if (!visible && newVisible && onOpen) onOpen();
    setVisibleState(newVisible);
  };

  const focusFirstElement = (dialog) => {
    console.log("is this getting called?")
    // only focus to next selectable element in dialog if popover is triggered from keyboard
    if (dialog && openedFromKeyboard) {
      // focus on the dialog if it has tabIndex=0 (used when there is only a destructible item in the popover that shouldn't automatically be focused on)
      if (dialog.tabIndex === 0) {
        dialog.focus();
      } else {
        const focusableElements =
          'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])';
        const focusableDialogElements = dialog.querySelectorAll(focusableElements);
        if (focusableDialogElements) {
          focusableDialogElements[0].focus();
        }
      }
    }
  };

  const togglePopover = (event) => {
    setVisible(!visible);
    if (event && event.detail === 0) {
      // opened from keyboard
      setOpenedFromKeyboard(true);
    } else {
      // opened from mouseclick
      setOpenedFromKeyboard(false);
    }
  };

  React.useEffect(() => {
    if (!visible) return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setVisible(false);
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [visible]);
  
  const props = { visible, setVisible, togglePopover, focusFirstElement };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(props) : null;

  return (
    <>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={() => setVisible(false)}>
        {inner}
      </MonitoredComponent>
    </>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  onOpen: null,
  outer: null,
  startOpen: false,
};

export default PopoverContainer;
