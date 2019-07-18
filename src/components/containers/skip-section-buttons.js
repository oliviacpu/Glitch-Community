import React from 'react';
import Button from 'Components/buttons/button';
import styles from './skip-section-buttons.styl';
import { snakeCase} from 'lodash';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeId = `before-${snakeCase(sectionName)}`;
  const afterId = `after-${snakeCase(sectionName)}`;
  
  return (
    <>
      <Button href={`#${afterId}`} id={beforeId} className={styles.visibleOnFocus}>
        Skip to After {sectionName}
      </Button>
      {children}
      <Button href={`#${beforeId}`} id={afterId} className={styles.visibleOnFocus}>
        Skip to Before {sectionName}
      </Button>
    </>
  );
};

export default SkipSectionButtons;
