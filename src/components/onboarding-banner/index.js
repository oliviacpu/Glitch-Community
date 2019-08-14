import React from 'react';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Link from 'Components/link';
import NewProjectPop from 'Components/header/new-project-pop';
import { lightColors } from 'Models/user';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

function OnboardingBanner() {
  const { currentUser } = useCurrentUser();

  return (
    <div
      className={styles.banner}
      style={{
        backgroundImage: 'https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fuser-pattern.svg',
        backgroundColor: lightColors[currentUser.id % 4],
      }}
    >
      <div className={styles.illustration}>
        <h1>Welcome to Glitch!</h1>
        <Image src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?v=1540583258925" alt="" />
      </div>

      <div className={styles.actions}>
        <div>
          <h2>Create your first project</h2>
          <Text>Jump into the editor by creating your very own app.</Text>
          <NewProjectPop buttonText="Create New Project" buttonType="cta" />
          <Link to="/create">Learn about creating on Glitch</Link>
        </div>
      </div>
    </div>
  );
}

export default OnboardingBanner;
