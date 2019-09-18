import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { orderBy, partition } from 'lodash';
import { Icon } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import FeaturedProject from 'Components/project/featured-project';
import Thanks from 'Components/thanks';
import UserNameInput from 'Components/fields/user-name-input';
import UserLoginInput from 'Components/fields/user-login-input';
import ProjectsList from 'Components/containers/projects-list';
import { UserProfileContainer } from 'Components/containers/profile';
import OnboardingBanner from 'Components/onboarding-banner';
import CollectionsList from 'Components/collections-list';
import DeletedProjects from 'Components/deleted-projects';
import ReportButton from 'Components/report-abuse-pop';
import AuthDescription from 'Components/fields/auth-description';
import { getUserLink } from 'Models/user';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useUserEditor } from 'State/user';
import useFocusFirst from 'Hooks/use-focus-first';

import styles from './user.styl';
import { emoji } from '../../components/global.styl';

function syncPageToLogin(login) {
  history.replaceState(null, null, getUserLink({ login }));
}

const NameAndLogin = ({ name, login, isAuthorized, updateName, updateLogin }) => {
  if (!login) {
    return <Heading tagName="h1">Anonymous</Heading>;
  }

  if (!isAuthorized) {
    if (!name) {
      return <Heading tagName="h1">@{login}</Heading>;
    }
    return (
      <>
        <Heading tagName="h1">{name}</Heading>
        <Heading tagName="h2">@{login}</Heading>
      </>
    );
  }
  const editableName = name !== null ? name : '';
  return (
    <>
      <Heading tagName="h1">
        <UserNameInput name={editableName} onChange={updateName} />
      </Heading>
      <Heading tagName="h2">
        <UserLoginInput login={login} onChange={updateLogin} />
      </Heading>
    </>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func.isRequired,
  updateLogin: PropTypes.func.isRequired,
};

NameAndLogin.defaultProps = {
  name: '',
  login: '',
};

const UserPage = ({ user: initialUser }) => {
  const [user, funcs] = useUserEditor(initialUser);
  const {
    updateDescription,
    updateName,
    updateLogin,
    uploadCover,
    clearCover,
    uploadAvatar,
    undeleteProject,
    unfeatureProject,
    setDeletedProjects,
    addProjectToCollection,
  } = funcs;
  const projectOptions = { ...funcs, user };
  const { _deletedProjects, featuredProjectId } = user;

  useFocusFirst();

  const { currentUser: maybeCurrentUser } = useCurrentUser();
  const isSupport = maybeCurrentUser && maybeCurrentUser.isSupport;
  const isAuthorized = maybeCurrentUser && maybeCurrentUser.id === user.id;

  const pinnedSet = new Set(user.pinnedProjects.map(({ id }) => id));
  // filter featuredProject out of both pinned & recent projects
  const sortedProjects = orderBy(user.projects, (project) => project.updatedAt, ['desc']);
  const [pinnedProjects, recentProjects] = partition(sortedProjects.filter(({ id }) => id !== featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = user.projects.find(({ id }) => id === featuredProjectId);

  return (
    <main id="main" className={styles.container}>
      <section>
        <UserProfileContainer
          item={user}
          coverActions={{
            'Upload Cover': isAuthorized && user.login ? uploadCover : null,
            'Clear Cover': isAuthorized && user.hasCoverImage ? clearCover : null,
          }}
          avatarActions={{
            'Upload Avatar': isAuthorized && user.login ? uploadAvatar : null,
          }}
          teams={user.teams}
        >
          <NameAndLogin
            name={user.name}
            login={user.login}
            {...{ isAuthorized, updateName }}
            updateLogin={(login) => updateLogin(login).then(() => syncPageToLogin(login))}
          />
          <Thanks count={user.thanksCount} />
          <AuthDescription
            authorized={isAuthorized && !!user.login}
            description={user.description}
            update={updateDescription}
            placeholder="Tell us about yourself"
          />
        </UserProfileContainer>

        {isAuthorized && !recentProjects.length && <OnboardingBanner />}
      </section>

      {featuredProject && (
        <FeaturedProject
          featuredProject={featuredProject}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          addProjectToCollection={addProjectToCollection}
          currentUser={maybeCurrentUser}
        />
      )}

      {/* Pinned Projects */}
      {pinnedProjects.length > 0 && (
        <ProjectsList
          dataCy="pinned-projects"
          layout="grid"
          title="Pinned Projects"
          titleEmoji="pushpin"
          projects={pinnedProjects}
          projectOptions={projectOptions}
        />
      )}

      {!!user.login && (
        <CollectionsList
          title="Collections"
          collections={user.collections.map((collection) => ({
            ...collection,
            user,
          }))}
          isAuthorized={isAuthorized}
          enablePagination
          enableFiltering={user.collections.length > 6}
          maybeCurrentUser={maybeCurrentUser}
        />
      )}

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <ProjectsList
          dataCy="recent-projects"
          layout="grid"
          title="Recent Projects"
          projects={recentProjects}
          enablePagination
          enableFiltering={recentProjects.length > 6}
          projectOptions={projectOptions}
        />
      )}

      {(isAuthorized || isSupport) && (
        <article data-cy="deleted-projects">
          <Heading tagName="h2">
            Deleted Projects
            <Icon className={emoji} icon="bomb" />
          </Heading>
          <DeletedProjects
            setDeletedProjects={setDeletedProjects}
            deletedProjects={_deletedProjects}
            undelete={isAuthorized ? undeleteProject : null}
            user={user}
          />
        </article>
      )}
      {!isAuthorized && <ReportButton reportedType="user" reportedModel={user} />}
    </main>
  );
};

UserPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    pinnedProjects: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
  }).isRequired,
};

const UserPageContainer = ({ user }) => (
  <AnalyticsContext properties={{ origin: 'user' }}>
    <Helmet title={user.name || (user.login ? `@${user.login}` : `User ${user.id}`)} />
    <UserPage user={user} />
  </AnalyticsContext>
);

export default UserPageContainer;
