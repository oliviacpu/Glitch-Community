import React from 'react';
import Button from 'Components/buttons/button';
import useUniqueId from 'Hooks/use-unique-id';
import styles from './skip-section-buttons.styl';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeId = useUniqueId();
  const afterId = useUniqueId();
  
  let sectionNameDisplay = sectionName;
  console.log(sectionName);
  if (typeof(sectionName == ) {
    const textNodes = [sectionName].filter((child) => ['p', 'P'].includes(child.tagName));
    sectionNameDisplay = textNodes.reduce((str, node) => str + node.innerText, '');  
  }
  
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
