import React, { useState, useEffect, useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

// statuses: 'closed' | 'openedFromKeyboard' | 'openedFromClick'
export const PopoverToggleContext = createContext('closed');

const usePopoverToggle = ({ startOpen, onOpen }) => {
  const [status, setStatus] = useState(startOpen ? 'openedFromKeyboard' : 'closed');

  const togglePopover = (event) => {
    const wasClosed = status === 'closed';

    if (wasClosed) {
      if (event && event.detail === 0) {
        setStatus('openedFromKeyboard');
      } else {
        setStatus('openedFromClick');
      }
      if (onOpen) {
        onOpen();
      }
    } else {
      setStatus('closed');
    }
  };

  useEffect(() => {
    if (status === 'closed') return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setStatus('closed');
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [status]);

  return { status, togglePopover };
};

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

export const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {
  const [visible, setVisibleState] = useState(startOpen);
  const [openedFromKeyboard, setOpenedFromKeyboard] = useState(false);
  const setVisible = (newVisible) => {
    if (!visible && newVisible && onOpen) onOpen();
    setVisibleState(newVisible);
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

  useEffect(() => {
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

  const props = { visible, setVisible, togglePopover };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(props) : null;

  return (
    <OpenedFromKeyboardContext.Provider value={openedFromKeyboard}>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={() => setVisible(false)}>
        {inner}
      </MonitoredComponent>
    </OpenedFromKeyboardContext.Provider>
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