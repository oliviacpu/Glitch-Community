import React, {useRef} from 'react';
import Button from 'Components/buttons/button';
import styles from './skip-section-buttons.styl';
import { snakeCase} from 'lodash';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeId = `before-${snakeCase(sectionName)}`;
  const afterId = `after-${snakeCase(sectionName)}`;
  const beforeRef = useRef();
  const afterRef = useRef();
  const moveFocusToAfter = () => {
    afterRef.current.focus();
  }
  
  const moveFocusToBefore = () => {
    beforeRef.current.focus();
  }
  
  return (
    <>
      <Button ref={beforeRef} onClick={moveFocusToAfter} id={beforeId} className={styles.visibleOnFocus}>
        Skip to After {sectionName}
      </Button>
      {children}
      <Button ref={afterRef} onClick={moveFocusToBefore} id={afterId} className={styles.visibleOnFocus}>
        Skip to Before {sectionName}
      </Button>
    </>
  );
};

export default SkipSectionButtons;
