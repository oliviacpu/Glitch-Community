/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import SearchForm from 'Components/search-form/search-form';
import { TrackedExternalLink } from './segment-analytics';
import { Link } from './includes/link';
import Logo from './includes/logo';
import UserOptionsPop from './pop-overs/user-options-pop';
import SignInPop from './pop-overs/sign-in-pop';
import NewProjectPop from './pop-overs/new-project-pop';
import NewStuffContainer from './overlays/new-stuff';
import { useCurrentUser } from '../state/current-user';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" className="button button-small button-cta" to={EDITOR_URL}>
    Resume Coding
  </TrackedExternalLink>
);

const Header = ({ maybeUser, clearUser, searchQuery, showNewStuffOverlay }) => (
  <header role="banner">
    <div className="header-info">
      <Link to="/">
        <Logo />
      </Link>
    </div>

    <nav>
      <div>
        <span className="header-search">
          <SearchForm defaultValue={searchQuery} />
        </span>
      </div>

      <NewProjectPop />
      {!!maybeUser && !!maybeUser.projects.length && <ResumeCoding />}
      {!(maybeUser && maybeUser.login) && <SignInPop />}
      {!!maybeUser && maybeUser.login && <UserOptionsPop user={maybeUser} signOut={clearUser} showNewStuffOverlay={showNewStuffOverlay} />}
    </nav>
  </header>
);

Header.propTypes = {
  maybeUser: PropTypes.object,
};

Header.defaultProps = {
  maybeUser: null,
};

const HeaderContainer = ({ ...props }) => {
  const { currentUser: user, clear } = useCurrentUser();
  return (
    <NewStuffContainer isSignedIn={!!user && !!user.login}>
      {(showNewStuffOverlay) => <Header {...props} maybeUser={user} clearUser={clear} showNewStuffOverlay={showNewStuffOverlay} />}
    </NewStuffContainer>
  );
};

export default HeaderContainer;
