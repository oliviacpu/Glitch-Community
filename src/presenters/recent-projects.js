import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import { ProjectsUL } from 'Components/containers/projects-list';
import Loader from 'Components/loaders/loader';
import CoverContainer from 'Components/containers/cover-container';

import { getAvatarStyle } from '../models/user';
import { useCurrentUser } from '../state/current-user';
import { UserLink } from './includes/link';

import ProjectsLoader from './projects-loader';
import SignInPop from './pop-overs/sign-in-pop';

const SignInNotice = () => (
  <div className="anon-user-sign-up">
    <span>
      <SignInPop /> to keep your projects.
    </span>
    <div className="note">Anonymous projects expire after 2 weeks</div>
  </div>
);

const ClearSession = ({ clearUser }) => {
  function clickClearSession() {
    if (
      // eslint-disable-next-line
      !window.confirm(`All activity from this anonymous account will be cleared.  Are you sure you want to continue?`)
    ) {
      return;
    }
    clearUser();
  }

  return (
    <div className="clear-session">
      <button type="button" onClick={clickClearSession} className="button-small has-emoji button-tertiary button-on-secondary-background">
        Clear Session <span className="emoji balloon" />
      </button>
    </div>
  );
};

const RecentProjectsContainer = ({ children, user, clearUser }) => (
  <section className="profile recent-projects">
    <Heading tagName="h2">
      <UserLink user={user}>Your Projects →</UserLink>
    </Heading>
    {!user.login && <SignInNotice />}
    <CoverContainer type="user" item={user}>
      <div className="profile-avatar">
        <div className="user-avatar-container">
          <UserLink user={user}>
            <div className={`user-avatar ${!user.login ? 'anon-user-avatar' : ''}`} style={getAvatarStyle(user)} alt="" />
          </UserLink>
        </div>
      </div>
      <article className="projects">{children}</article>
      {!user.login && <ClearSession clearUser={clearUser} />}
    </CoverContainer>
  </section>
);
RecentProjectsContainer.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
  clearUser: PropTypes.func.isRequired,
};

const RecentProjects = () => {
  const { currentUser: user, fetched, clear } = useCurrentUser();
  return (
    <RecentProjectsContainer user={user} clearUser={clear}>
      {fetched ? (
        <ProjectsLoader projects={user.projects.slice(0, 3)}>{(projects) => <ProjectsUL projects={projects} />}</ProjectsLoader>
      ) : (
        <Loader />
      )}
    </RecentProjectsContainer>
  );
};

export default RecentProjects;
