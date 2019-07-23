import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { snakeCase } from 'lodash';
import Button from 'Components/buttons/button';
import useUniqueId from 'Hooks/use-unique-id';
import styles from './skip-section-buttons.styl';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeRef = useRef();
  const afterRef = useRef();

  // hooks must be called on every render, but if sectionName exists we don't need to use those values
  let beforeId = useUniqueId();
  let afterId = useUniqueId();

  
  if (sectionName && sectionName !== 'This Section') {
    beforeId = `before-${snakeCase(sectionName)}`;
    afterId = `after-${snakeCase(sectionName)}`;
  }


  const moveFocusToAfter = () => {
    afterRef.current.focus();
  };

  const moveFocusToBefore = () => {
    beforeRef.current.focus();
  };

  return (
    <div>
      <Button ref={beforeRef} onClick={moveFocusToAfter} id={beforeId} className={styles.visibleOnFocus}>
        Skip to After {sectionName}
      </Button>
      {children}
      <Button ref={afterRef} onClick={moveFocusToBefore} id={afterId} className={styles.visibleOnFocus}>
        Skip to Before {sectionName}
      </Button>
    </div>
  );
};


SkipSectionButtons.propTypes = {
  sectionName: PropTypes.node.isRequired,
}
SkipSectionButtons.defaultProps = {
  sectionName: 'This Section',
};

export default SkipSectionButtons;
