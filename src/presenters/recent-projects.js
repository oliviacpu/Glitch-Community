import React from 'react';
import PropTypes from 'prop-types';

import { getAvatarStyle, getProfileStyle } from '../models/user';
import { UserLink } from './includes/link';

import { CoverContainer } from './includes/profile';
import { Loader } from './includes/loader';
import ProjectsLoader from './projects-loader';
import { ProjectsUL } from './projects-list';
import SignInPop from './pop-overs/sign-in-pop';

import Heading from '../components/text/heading';
import { useCurrentUser, useLoadState } from '../state/current-user';

const RecentProjectsContainer = ({ children, user }) => (
  <section className="profile recent-projects">
    <Heading tagName="h2">
      <UserLink user={user}>Your Projects →</UserLink>
    </Heading>
    <CoverContainer style={getProfileStyle(user)}>
      <div className="profile-avatar">
        <div className="user-avatar-container">
          <UserLink user={user}>
            <div className={`user-avatar ${!user.login ? 'anon-user-avatar' : ''}`} style={getAvatarStyle(user)} alt="" />
          </UserLink>
          {!user.login && (
            <div className="anon-user-sign-up">
              <SignInPop />
            </div>
          )}
        </div>
      </div>
      <article className="projects">{children}</article>
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
};

const RecentProjects = () => {
  const user = useCurrentUser();
  const fetched = useLoadState() === 'ready';
  return (
    <RecentProjectsContainer user={user}>
      {fetched ? (
        <ProjectsLoader projects={user.projects.slice(0, 3)}>{(projects) => <ProjectsUL projects={projects} />}</ProjectsLoader>
      ) : (
        <Loader />
      )}
    </RecentProjectsContainer>
  );
};
export default RecentProjects;
