import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import { EDITOR_URL } from 'Utils/constants';
import SearchForm from 'Components/search-form';
import SignInPop from 'Components/sign-in-pop';
import UserOptionsPop from 'Components/user-options-pop';
import NewProjectPop from 'Components/new-project-pop';
import Link, { TrackedExternalLink } from 'Components/link';
import { useCurrentUser } from 'State/current-user';
import { AnalyticsContext } from 'State/segment-analytics';
import { useGlobals } from 'State/globals';
import Logo from './logo';
import styles from './header.styl';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" to={EDITOR_URL}>
    <Button variant="cta" size="small" as="span">
      Resume Coding
    </Button>
  </TrackedExternalLink>
);

const Header = ({ searchQuery, showAccountSettingsOverlay, showNewStuffOverlay }) => {
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN } = useGlobals();
  // signedIn and signedOut are both false on the server so the sign in button doesn't render
  const fakeSignedIn = !currentUser.id && SSR_SIGNED_IN;
  const signedIn = !!currentUser.login || fakeSignedIn;
  const signedOut = !!currentUser.id && !signedIn;
  const hasProjects = currentUser.projects.length > 0 || fakeSignedIn;
  return (
    <AnalyticsContext properties={{ origin: 'navbar' }}>
      <header role="banner" className={styles.header}>
        <Button as="a" href="#main" className={styles.visibleOnFocus}>
          Skip to Main Content
        </Button>
        <Link to="/" className={styles.logoWrap}>
          <Logo />
        </Link>
        <nav className={styles.headerActions}>
          <div className={styles.searchWrap}>
            <SearchForm defaultValue={searchQuery} />
          </div>
          <ul className={styles.buttons}>
            {(signedIn || signedOut) && (
              <li className={styles.buttonWrap}>
                <NewProjectPop />
              </li>
            )}
            {hasProjects && (
              <li className={styles.buttonWrap}>
                <ResumeCoding />
              </li>
            )}
            {signedOut && (
              <li className={styles.buttonWrap}>
                <SignInPop align="right" />
              </li>
            )}
            {signedIn && (
              <li className={styles.buttonWrap}>
                <UserOptionsPop showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
              </li>
            )}
          </ul>
        </nav>
      </header>
    </AnalyticsContext>
  );
};

Header.propTypes = {
  searchQuery: PropTypes.string,
  showAccountSettingsOverlay: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

Header.defaultProps = {
  searchQuery: '',
};

export default Header;
