/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import SearchForm from 'Components/search-form';
import { TrackedExternalLink } from '../../presenters/segment-analytics';
import { Link } from '../../presenters/includes/link';
import UserOptionsPop from '../../presenters/pop-overs/user-options-pop';
import SignInPop from '../../presenters/pop-overs/sign-in-pop';
import NewProjectPop from '../../presenters/new-project-pop';
import { useCurrentUser } from '../../state/current-user';
import Logo from './logo';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" className="button button-small button-cta" to={EDITOR_URL}>
    Resume Coding
  </TrackedExternalLink>
);

const Header = ({ searchQuery, showNewStuffOverlay }) => {
  const { currentUser, clear } = useCurrentUser();
  return (
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
        {!!currentUser && !!currentUser.projects.length && <ResumeCoding />}
        {!(currentUser && currentUser.login) && <SignInPop />}
        {!!currentUser && currentUser.login && <UserOptionsPop user={currentUser} signOut={clear} showNewStuffOverlay={showNewStuffOverlay} />}
      </nav>
    </header>
  );
};

Header.propTypes = {
  searchQuery: PropTypes.string,
  showNewStuffOverlay: PropTypes.bool,
};

Header.defaultProps = {
  searchQuery: '',
  showNewStuffOverlay: false,
};

export default Header;
