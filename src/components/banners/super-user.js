import React from 'react';
import { useCurrentUser } from 'State/current-user';
import Button from 'Components/buttons/button';
import styles from './super-user.styl';

const SuperUserBanner = () => {
  const { superUserHelpers } = useCurrentUser();
  const { superUserFeature, toggleSuperUser } = superUserHelpers;

  if (!superUserFeature) {
    return null;
  }

  const expirationDate = superUserFeature && new Date(superUserFeature.expiresAt).toLocaleString();
  const displayText = `SUPER USER MODE ENABLED UNTIL: ${expirationDate} `;
  return (
    <div className={styles.container}>
      {displayText}
      <Button onClick={toggleSuperUser}>Click to disable</Button>
    </div>
  );
};

export default SuperUserBanner;
