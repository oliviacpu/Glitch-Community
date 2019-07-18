import React from 'react';
import Button from 'Components/buttons/button';
import useUniqueId from 'Hooks/use-unique-id';
import styles from './skip-section-buttons.styl';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeId = useUniqueId();
  const afterId = useUniqueId();
  return (
    <>
      <Button href={`#${after}`} id={before} className={styles.visibleOnFocus}>
        Skip to After {sectionName}
      </Button>
      {children}
      <Button href={`#${before}`} id={after} className={styles.visibleOnFocus}>
        Skip to Before {sectionName}
      </Button>
    </>
  );
};

export default SkipSectionButtons;
