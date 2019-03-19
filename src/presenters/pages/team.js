import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { partition } from 'lodash';
import { AnalyticsContext } from '../analytics';
import { DataLoader } from '../includes/loader';
import TeamEditor from '../team-editor';
import { getLink, getAvatarStyle, getProfileStyle } from '../../models/team';
import { AuthDescription } from '../includes/description-field';
import { ProfileContainer, ImageButtons } from '../includes/profile';
import ErrorBoundary from '../includes/error-boundary';
import { captureException } from '../../utils/sentry';

// import SampleTeamCollections from '../../curated/sample-team-collections';
import CollectionsList from '../collections-list';

import EditableField from '../includes/editable-field';
import { Thanks } from '../includes/thanks';
import NameConflictWarning from '../includes/name-conflict';
import AddTeamProject from '../includes/add-team-project';
import DeleteTeam from '../includes/delete-team';
import { AddTeamUser, TeamUsers, WhitelistedDomain, JoinTeam } from '../includes/team-users';
import EntityPageFeaturedProject from '../entity-page-featured-project';
import EntityPageProjects from '../entity-page-projects';
import ProjectsLoader from '../projects-loader';
import TeamAnalytics from '../includes/team-analytics';
import { TeamMarketing, VerifiedBadge } from '../includes/team-elements';
import ReportButton from '../pop-overs/report-abuse-pop';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import Heading from '../../components/text/heading';

function syncPageToUrl(team) {
  history.replaceState(null, null, getLink(team));
}

const TeamNameUrlFields = ({ team, updateName, updateUrl }) => (
  <>
    <Heading tagName="h1">
      <EditableField value={team.name} update={updateName} placeholder="What's its name?" suffix={team.isVerified ? <VerifiedBadge /> : null} />
    </Heading>
    <p className="team-url">
      <EditableField
        value={team.url}
        update={(url) => updateUrl(url).then(() => syncPageToUrl({ ...team, url }))}
        placeholder="Short url?"
        prefix="@"
      />
    </p>
  </>
);

const TeamPageCollections = ({ collections, team, currentUserIsOnTeam }) => (
  <CollectionsList
    title="Collections"
    collections={collections.map((collection) => ({ ...collection, team }))}
    maybeTeam={team}
    isAuthorized={currentUserIsOnTeam}
  />
);

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitees: [],
    };
    this.teamAdmins = this.teamAdmins.bind(this);
    this.getInvitees = this.getInvitees.bind(this);
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }

  async componentDidMount() {
    const invitees = await this.getInvitees();
    this.setState({ invitees });
  }

  getProjectOptions() {
    const projectOptions = {
      addProjectToCollection: this.addProjectToCollection,
      deleteProject: this.props.deleteProject,
      leaveTeamProject: this.props.leaveTeamProject,
    };
    if (this.props.currentUserIsOnTeam) {
      projectOptions.removeProjectFromTeam = this.props.removeProject;
      projectOptions.joinTeamProject = this.props.joinTeamProject;
      projectOptions.featureProject = this.props.featureProject;
    }

    return projectOptions;
  }

  async getInvitees() {
    if (this.props.currentUserIsOnTeam) {
      try {
        const data = await Promise.all(this.props.team.tokens.map(({ userId }) => this.props.api.get(`users/${userId}`)));
        const invitees = data.map((user) => user.data).filter((user) => !!user);
        return invitees;
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          return null;
        }
        captureException(error);
      }
    }
    return [];
  }

  userCanJoinTeam() {
    const { currentUser, team } = this.props;
    if (!this.props.currentUserIsOnTeam && team.whitelistedDomain && currentUser && currentUser.emails) {
      return currentUser.emails.some(({ email, verified }) => verified && email.endsWith(`@${team.whitelistedDomain}`));
    }
    return false;
  }

  teamAdmins() {
    return this.props.team.users.filter((user) => this.props.team.adminIds.includes(user.id));
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  render() {
    const { team } = this.props;
    const pinnedSet = new Set(team.teamPins.map(({ projectId }) => projectId));
    // filter featuredProject out of both pinned & recent projects
    const [pinnedProjects, recentProjects] = partition(team.projects.filter(({ id }) => id !== team.featuredProjectId), ({ id }) =>
      pinnedSet.has(id),
    );
    const featuredProject = team.projects.find(({ id }) => id === team.featuredProjectId);

    return (
      <main className="profile-page team-page">
        <section>
          <a href="/teams/" target="_blank" className="beta">
            <img src="https://cdn.glitch.com/0c3ba0da-dac8-4904-bb5e-e1c7acc378a2%2Fbeta-flag.svg?1541448893958" alt="" />
            <div>
              <Heading tagName="h4">Teams are in beta</Heading>
              <p>Learn More</p>
            </div>
          </a>
          <ProfileContainer
            avatarStyle={getAvatarStyle({ ...team, cache: team._cacheAvatar })} // eslint-disable-line
            coverStyle={getProfileStyle({ ...team, cache: team._cacheCover })} // eslint-disable-line
            avatarButtons={this.props.currentUserIsTeamAdmin ? <ImageButtons name="Avatar" uploadImage={this.props.uploadAvatar} /> : null}
            coverButtons={
              this.props.currentUserIsTeamAdmin ? (
                <ImageButtons name="Cover" uploadImage={this.props.uploadCover} clearImage={team.hasCoverImage ? this.props.clearCover : null} />
              ) : null
            }
          >
            {this.props.currentUserIsTeamAdmin ? (
              <TeamNameUrlFields team={team} updateName={this.props.updateName} updateUrl={this.props.updateUrl} />
            ) : (
              <>
                <Heading tagName="h1">
                  {team.name} {team.isVerified && <VerifiedBadge />}
                </Heading>
                <p className="team-url">@{team.url}</p>
              </>
            )}
            <div className="users-information">
              <TeamUsers {...this.props} users={team.users} teamId={team.id} adminIds={team.adminIds} />
              {!!team.whitelistedDomain && (
                <WhitelistedDomain
                  domain={team.whitelistedDomain}
                  setDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                />
              )}
              {this.props.currentUserIsOnTeam && (
                <AddTeamUser
                  inviteEmail={this.props.inviteEmail}
                  inviteUser={this.props.inviteUser}
                  setWhitelistedDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                  members={team.users.map(({ id }) => id)}
                  invitedMembers={this.state.invitees}
                  whitelistedDomain={team.whitelistedDomain}
                  api={this.props.api}
                />
              )}
              {this.userCanJoinTeam() && <JoinTeam onClick={this.props.joinTeam} />}
            </div>
            <Thanks count={team.users.reduce((total, { thanksCount }) => total + thanksCount, 0)} />
            <AuthDescription
              authorized={this.props.currentUserIsTeamAdmin}
              description={team.description}
              update={this.props.updateDescription}
              placeholder="Tell us about your team"
            />
          </ProfileContainer>
        </section>

        <ErrorBoundary>
          <AddTeamProject {...this.props} teamProjects={team.projects} api={this.props.api} />
        </ErrorBoundary>

        {featuredProject && (
          <EntityPageFeaturedProject
            featuredProject={featuredProject}
            isAuthorized={this.props.currentUserIsOnTeam}
            unfeatureProject={this.props.unfeatureProject}
            addProjectToCollection={this.props.addProjectToCollection}
          />
        )}

        {/* Pinned Projects */}
        <EntityPageProjects
          projects={pinnedProjects}
          isAuthorized={this.props.currentUserIsOnTeam}
          removePin={this.props.removePin}
          projectOptions={this.getProjectOptions()}
        />

        {/* Recent Projects */}
        <EntityPageProjects
          projects={recentProjects}
          isAuthorized={this.props.currentUserIsOnTeam}
          addPin={this.props.addPin}
          projectOptions={this.getProjectOptions()}
        />

        {team.projects.length === 0 && this.props.currentUserIsOnTeam && (
          <aside className="inline-banners add-project-to-empty-team-banner">
            <div className="description-container">
              <img
                className="project-pals"
                src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925"
                alt=""
              />
              <div className="description">Add projects to share them with your team</div>
            </div>
          </aside>
        )}

        {/* TEAM COLLECTIONS */}
        <ErrorBoundary>
          <DataLoader
            get={() => this.props.api.get(`collections?teamId=${team.id}`)}
            renderLoader={() => <TeamPageCollections {...this.props} collections={team.collections} />}
          >
            {({ data }) => <TeamPageCollections {...this.props} collections={data} />}
          </DataLoader>
        </ErrorBoundary>

        {this.props.currentUserIsOnTeam && (
          <ErrorBoundary>
            <TeamAnalytics
              api={this.props.api}
              id={team.id}
              currentUserIsOnTeam={this.props.currentUserIsOnTeam}
              projects={team.projects}
              addProject={this.props.addProject}
              myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
            />
          </ErrorBoundary>
        )}

        {this.props.currentUserIsTeamAdmin && (
          <DeleteTeam api={() => this.props.api} teamId={team.id} teamName={team.name} teamAdmins={this.teamAdmins()} users={team.users} />
        )}

        {!this.props.currentUserIsOnTeam && (
          <>
            <ReportButton reportedType="team" reportedModel={team} />
            <TeamMarketing />
          </>
        )}
      </main>
    );
  }
}

TeamPage.propTypes = {
  team: PropTypes.shape({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    teamPins: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    whitelistedDomain: PropTypes.string,
    featuredProjectId: PropTypes.string,
  }).isRequired,
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  updateWhitelistedDomain: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  api: PropTypes.func,
  clearCover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  featureProject: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};
TeamPage.defaultProps = {
  api: null,
};

const teamConflictsWithUser = (team, currentUser) => {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }
  return false;
};

const TeamNameConflict = ({ team, currentUser }) => (
  teamConflictsWithUser(team, currentUser) && <NameConflictWarning />
);

const TeamPageEditor = ({ api, initialTeam, children }) => (
  <TeamEditor api={api} initialTeam={initialTeam}>
    {(team, funcs, ...args) => (
      <ProjectsLoader projects={team.projects}>
        {(projects, reloadProjects) => {
          // Inject page specific changes to the editor
          // Mainly url updating and calls to reloadProjects

          const removeUserFromTeam = async (user, projectIds) => {
            await funcs.removeUserFromTeam(user, projectIds);
            reloadProjects(...projectIds);
          };

          const joinTeamProject = async (projectId) => {
            await funcs.joinTeamProject(projectId);
            reloadProjects(projectId);
          };

          const leaveTeamProject = async (projectId) => {
            await funcs.leaveTeamProject(projectId);
            reloadProjects(projectId);
          };

          return children(
            { ...team, projects },
            {
              ...funcs,
              removeUserFromTeam,
              joinTeamProject,
              leaveTeamProject,
            },
            ...args,
          );
        }}
      </ProjectsLoader>
    )}
  </TeamEditor>
);
const TeamPageContainer = ({ team, ...props }) => {
  const currentUser = useCurrentUser();
  const api = useAPI();
  return (
    <AnalyticsContext properties={{ origin: 'team' }} context={{ groupId: team.id.toString() }}>
      <TeamPageEditor initialTeam={team}>
        {(teamFromEditor, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
          <>
            <Helmet>
              <title>{teamFromEditor.name}</title>
            </Helmet>
            <TeamPage
              team={teamFromEditor}
              {...funcs}
              api={api}
              currentUser={currentUser}
              currentUserIsOnTeam={currentUserIsOnTeam}
              currentUserIsTeamAdmin={currentUserIsTeamAdmin}
              {...props}
            />
            <TeamNameConflict team={teamFromEditor} currentUser={currentUser} />
          </>
        )}
      </TeamPageEditor>
    </AnalyticsContext>
  );
};
export default TeamPageContainer;
