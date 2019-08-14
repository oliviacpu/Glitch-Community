import React from 'react';
import Image from 'Components/images/image';
import Emoji from 'Components/images/emoji';
import Text from 'Components/text/text';
import Link from 'Components/link';
import NewProjectPop from 'Components/header/new-project-pop';
import CategoriesGrid from 'Components/categories-grid';
import { lightColors } from 'Models/user';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

function OnboardingBanner() {
  const { currentUser } = useCurrentUser();

  return (
    <div
      className={styles.banner}
      style={{
        backgroundImage: 'url(https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fuser-pattern.svg)',
        backgroundColor: lightColors[currentUser.id % 4],
      }}
    >
      <div className={styles.illustration}>
        <Image src="https://cdn.glitch.com/064b323a-e0b3-43bc-a6e8-79163b0b5d7a%2Fwelcome-to-glitch.svg?v=1565796609099" alt="" />
      </div>

      <div className={styles.actions}>
        <div className={styles.create}>
          <h2>Create your first project</h2>
          <Text defaultMargin>Jump into the editor by creating your very own app.</Text>
          <NewProjectPop buttonText="Create New Project" buttonType="cta" />
          <Text defaultMargin>
            <Link to="/create">Learn about creating on Glitch</Link>
          </Text>
        </div>
        
        <div className={styles.explore}>
          <Text>
            <strong>...or explore starter apps</strong> to find a project to remix.
          </Text>
          <CategoriesGrid alwaysWrap categories={['games', 'music', 'art', 'handy-bots', 'learn-to-code', 'tools-for-work']} />
          
          <Text>
            Find even more inspiration below with our <Link to="#top-picks">featured apps</Link> <Emoji name="backhandIndex" />
          </Text>
        </div>
      </div>
    </div>
  );
}

export default OnboardingBanner;
