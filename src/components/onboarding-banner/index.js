import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Emoji from 'Components/images/emoji';
import Text from 'Components/text/text';
import Link from 'Components/link';
import NewProjectPop from 'Components/new-project-pop';
import CategoriesGrid from 'Components/categories-grid';
import { lightColors } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import useWindowSize from 'Hooks/use-window-size';

import Illustration from './illustration';
import styles from './styles.styl';

function OnboardingBanner({ isHomepage }) {
  const { currentUser } = useCurrentUser();
  const exploreEl = useRef();

  const [categoriesWidth, setCategoriesWidth] = useState(0);
  const [windowWidth] = useWindowSize();
  useEffect(
    () => {
      const width = exploreEl.current ? exploreEl.current.offsetWidth : 0;
      setCategoriesWidth(width);
    },
    [windowWidth],
  );

  const backgroundStyles = isHomepage
    ? {
        backgroundImage: 'url(https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fuser-pattern.svg)',
        backgroundColor: lightColors[currentUser.id % 4],
      }
    : null;
  const sourceLabel = `${isHomepage ? 'homepage' : 'profile page'} onboarding banner`;

  return (
    <div className={styles.banner} style={backgroundStyles}>
      <div className={styles.illustration}>
        <h1>
          <Illustration />
        </h1>
      </div>

      <div className={styles.actions} style={{ background: isHomepage ? 'rgba(255, 255, 255, .875)' : 'none' }}>
        <div className={styles.create}>
          <h2 className={styles.createHeading}>Create your first project</h2>
          <Text size="15px" defaultMargin>
            Jump into the editor by creating your very own app.
          </Text>
          <NewProjectPop align="left" buttonText="Create New Project" buttonType="cta" source={sourceLabel} />
          <Text className={styles.createCta} size="15px" defaultMargin>
            <Link to="/create">Learn about creating on Glitch</Link>
          </Text>
        </div>

        <div className={styles.explore} ref={exploreEl}>
          <Text defaultMargin size="15px">
            <strong>...or explore starter apps</strong> to find a project to remix.
          </Text>
          <CategoriesGrid
            wrapItems={categoriesWidth > 610}
            className={styles.categoriesGrid}
            categories={['games', 'music', 'art', 'handy-bots', 'learn-to-code', 'tools-for-work']}
          />

          {isHomepage && (
            <Text size="15px">
              Find even more inspiration below with our <Link to="#top-picks">featured apps</Link> <Emoji name="backhandIndex" />
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

OnboardingBanner.propTypes = {
  isHomepage: PropTypes.bool,
};

OnboardingBanner.defaultProps = {
  isHomepage: false,
};

export default OnboardingBanner;
