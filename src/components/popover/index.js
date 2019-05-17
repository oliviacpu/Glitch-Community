import React, { useState, useEffect, useLayoutEffect, useRef, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from 'lodash';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';

import { PopoverContainer, PopoverToggleContext } from './container';
import styles from './styles.styl';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/



const sectionTypes = ['primary', 'secondary', 'dangerZone'];
export const PopoverSection = ({ className, children, type }) => (
  <section className={classnames(styles.popoverSection, styles[type], className)}>{children}</section>
);

PopoverSection.propTypes = {
  type: PropTypes.oneOf(sectionTypes),
  children: PropTypes.node.isRequired,
};

PopoverSection.defaultProps = {
  type: 'primary',
};

export const PopoverActions = ({ ...props }) => <PopoverSection {...props} className={styles.popoverActions} />;

const styled = (Component, baseClassName) => ({ className, ...props }) => <Component className={classnames(className, baseClassName)} {...props} />;
export const PopoverTitle = styled('div', styles.popoverTitle);
export const InfoDescription = styled('p', styles.infoDescription);



const NestedPopoverContext = createContext();

export function NestedPopover({ startAlternateVisible, alternateContent, children }) {
  const [altVisible, setAltVisible] = useState(startAlternateVisible);
  const toggle = () => setAltVisible((isVisible) => !isVisible);
  // Only use the provider on the sub menu
  // Nested consumers want the back button, not the open menu
  if (altVisible) {
    return <NestedPopoverContext.Provider value={toggle}>{alternateContent(toggle)}</NestedPopoverContext.Provider>;
  }
  return children(toggle);
}

NestedPopover.propTypes = {
  children: PropTypes.func.isRequired,
  alternateContent: PropTypes.func.isRequired,
  startAlternateVisible: PropTypes.bool,
};
NestedPopover.defaultProps = {
  startAlternateVisible: false,
};

export const NestedPopoverTitle = ({ children }) => {
  const toggle = useContext(NestedPopoverContext);
  return (
    <TransparentButton onClick={toggle} aria-label="go back">
      <PopoverSection type="secondary">
        <div className="left-arrow icon" />
        &nbsp;
        <PopoverTitle>{children}</PopoverTitle>
      </PopoverSection>
    </TransparentButton>
  );
};
NestedPopoverTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PopoverWithButton = ({ buttonProps, buttonText, children: renderChildren, onOpen }) => (
  <div className={styles.popoverWithButtonWrap}>
    <PopoverContainer onOpen={onOpen}>
      {({ visible, togglePopover }) => (
        <div>
          <div className={styles.buttonWrap}>
            <Button {...buttonProps} onClick={togglePopover}>
              {buttonText}
            </Button>
          </div>
          {visible && renderChildren({ togglePopover })}
        </div>
      )}
    </PopoverContainer>
  </div>
);

PopoverWithButton.propTypes = {
  buttonProps: PropTypes.object,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};

PopoverWithButton.defaultProps = {
  buttonProps: {},
  onOpen: null,
};
