import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { orderBy, partition } from 'lodash';
import { getAvatarStyle, getLink, getProfileStyle } from '../../models/user';

import { AnalyticsContext } from '../analytics';
import { CurrentUserConsumer } from '../current-user';
import { AuthDescription } from '../includes/description-field';
import EditableField from '../includes/editable-field';
import UserEditor from '../user-editor';
import { Thanks } from '../includes/thanks';

import DeletedProjects from '../deleted-projects';
import EntityPageFeaturedProject from '../entity-page-featured-project';
import EntityPageProjects from '../entity-page-projects';
import CollectionsList from '../collections-list';
import { ProfileContainer, ImageButtons } from '../includes/profile';
import ProjectsLoader from '../projects-loader';
import ReportButton from '../pop-overs/report-abuse-pop';
import Heading from '../../components/text/heading';

function syncPageToLogin(login) {
  history.replaceState(null, null, getLink({ login }));
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
        <EditableField value={editableName} update={updateName} placeholder="What's your name?" />
      </Heading>
      <Heading tagName="h2">
        <EditableField value={login} update={updateLogin} prefix="@" placeholder="Nickname?" />
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

// has science gone too far?
const UserPage = ({
  user: {
    // has science gone too far?
    _deletedProjects,
    _cacheCover,
    featuredProjectId,
    ...user
  },
  api,
  isAuthorized,
  maybeCurrentUser,
  updateDescription,
  updateName,
  updateLogin,
  uploadCover,
  clearCover,
  uploadAvatar,
  addPin,
  removePin,
  leaveProject,
  deleteProject,
  undeleteProject,
  featureProject,
  unfeatureProject,
  setDeletedProjects,
  addProjectToCollection,
}) => {
  const pinnedSet = new Set(user.pins.map(({ id }) => id));
  // filter featuredProject out of both pinned & recent projects
  const [pinnedProjects, recentProjects] = partition(user.projects.filter(({ id }) => id !== featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = user.projects.find(({ id }) => id === featuredProjectId);

  return (
    <main className="profile-page user-page">
      <section>
        <ProfileContainer
          avatarStyle={getAvatarStyle(user)}
          coverStyle={getProfileStyle({ ...user, cache: _cacheCover })}
          coverButtons={
            isAuthorized &&
            !!user.login && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={user.hasCoverImage ? clearCover : null} />
          }
          avatarButtons={isAuthorized && !!user.login && <ImageButtons name="Avatar" uploadImage={uploadAvatar} />}
          teams={user.teams}
        >
          <NameAndLogin
            name={user.name}
            login={user.login}
            {...{ isAuthorized, updateName }}
            updateLogin={(login) => updateLogin(login).then(() => syncPageToLogin(login))}
          />
          {!!user.thanksCount && <Thanks count={user.thanksCount} />}
          <AuthDescription
            authorized={isAuthorized && !!user.login}
            description={user.description}
            update={updateDescription}
            placeholder="Tell us about yourself"
          />
        </ProfileContainer>
      </section>

      {featuredProject && (
        <EntityPageFeaturedProject
          featuredProject={featuredProject}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          addProjectToCollection={addProjectToCollection}
        />
      )}

      {/* Pinned Projects */}
      <EntityPageProjects
        projects={pinnedProjects}
        isAuthorized={isAuthorized}
        removePin={removePin}
        projectOptions={{
          featureProject,
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
      />

      {!!user.login && (
        <CollectionsList
          title="Collections"
          collections={user.collections.map((collection) => ({
            ...collection,
            user,
          }))}
          api={api}
          isAuthorized={isAuthorized}
          maybeCurrentUser={maybeCurrentUser}
        />
      )}

      {/* Recent Projects */}
      <EntityPageProjects
        projects={recentProjects}
        isAuthorized={isAuthorized}
        addPin={addPin}
        projectOptions={{
          featureProject,
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
      />
      {isAuthorized && (
        <DeletedProjects setDeletedProjects={setDeletedProjects} deletedProjects={_deletedProjects} undelete={undeleteProject} />
      )}
      {!isAuthorized && <ReportButton reportedType="user" reportedModel={user} />}
    </main>
  );
};

UserPage.propTypes = {
  clearCover: PropTypes.func.isRequired,
  maybeCurrentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  leaveProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
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
    pins: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    _deletedProjects: PropTypes.array.isRequired,
  }).isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  featureProject: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
};

const UserPageContainer = ({ api, user }) => (
  <AnalyticsContext properties={{ origin: 'user' }}>
    <UserEditor api={api} initialUser={user}>
      {(userFromEditor, funcs, isAuthorized) => (
        <>
          <Helmet>
            <title>{userFromEditor.name || (userFromEditor.login ? `@${userFromEditor.login}` : `User ${userFromEditor.id}`)}</title>
          </Helmet>

          <CurrentUserConsumer>
            {(maybeCurrentUser) => (
              <ProjectsLoader api={api} projects={orderBy(userFromEditor.projects, (project) => project.updatedAt, ['desc'])}>
                {(projects) => <UserPage {...{ api, isAuthorized, maybeCurrentUser }} user={{ ...userFromEditor, projects }} {...funcs} />}
              </ProjectsLoader>
            )}
          </CurrentUserConsumer>
        </>
      )}
    </UserEditor>
  </AnalyticsContext>
);

export default UserPageContainer;
