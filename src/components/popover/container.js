import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

// statuses: 'closed' | 'openedFromKeyboard' | 'openedFromClick'
const usePopoverToggle = ({ startOpen, onOpen }) => {
  const [status, setStatus] = useState(startOpen ? 'openedFromKeyboard' : 'closed');

  const closePopover = () => setStatus('closed');

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

  return { status, closePopover, togglePopover };
};

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

export const PopoverToggleContext = createContext(null);

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

export const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {
  const { status, closePopover, togglePopover } = usePopoverToggle({ startOpen, onOpen });

  const props = { status, visible: status !== 'closed', closePopover, togglePopover };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(props) : null;

  return (
    <PopoverToggleContext.Provider value={status}>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={closePopover}>
        {inner}
      </MonitoredComponent>
    </PopoverToggleContext.Provider>
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
