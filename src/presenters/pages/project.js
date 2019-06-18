import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import Helmet from 'react-helmet';

import Button from 'Components/buttons/button';
import CheckboxButton from 'Components/buttons/checkbox-button';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Heading from 'Components/text/heading';
import Loader from 'Components/loader';
import Markdown from 'Components/text/markdown';
import NotFound from 'Components/errors/not-found';
import CollectionItem from 'Components/collection/collection-item';
import ProjectEmbed from 'Components/project/project-embed';
import ProfileList from 'Components/profile-list';
import ProjectDomainInput from 'Components/fields/project-domain-input';
import { ProjectProfileContainer } from 'Components/containers/profile';
import DataLoader from 'Components/data-loader';
import Row from 'Components/containers/row';
import RelatedProjects from 'Components/related-projects';
import { PopoverWithButton, PopoverDialog, PopoverActions, ActionDescription } from 'Components/popover';
import { ShowButton, EditButton } from 'Components/project/project-actions';
import AuthDescription from 'Components/fields/auth-description';
import Layout from 'Components/layout';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useProjectEditor, getProjectByDomain } from 'State/project';
import { getLink as getUserLink } from 'Models/user';
import { userIsProjectMember } from 'Models/project';
import { addBreadcrumb } from 'Utils/sentry';
import { getSingleItem, getAllPages, allByKeys } from 'Shared/api';

import Expander from '../includes/expander';

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const getIncludedCollections = async (api, projectId) => {
  const collections = await getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  const selectedCollections = sampleSize(collections, 3);
  const populatedCollections = await Promise.all(
    selectedCollections.map(async (collection) => {
      const { projects, user, team } = await allByKeys({
        projects: getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100&orderKey=projectOrder&orderDirection=ASC`),
        user: collection.user && getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id),
        team: collection.team && getSingleItem(api, `v1/teams/by/id?id=${collection.team.id}`, collection.team.id),
      });
      return { ...collection, projects, user, team };
    }),
  );
  return populatedCollections.filter((c) => c.team || c.user);
};

const IncludedInCollections = ({ projectId }) => (
  <DataLoader get={(api) => getIncludedCollections(api, projectId)} renderLoader={() => null}>
    {(collections) =>
      collections.length > 0 && (
        <>
          <Heading tagName="h2">Included in Collections</Heading>
          <Row items={collections}>{(collection) => <CollectionItem collection={collection} showCurator />}</Row>
        </>
      )
    }
  </DataLoader>
);

const PrivateTooltip = 'Only members can view code';
const PublicTooltip = 'Visible to everyone';

const PrivateBadge = () => (
  <TooltipContainer
    type="info"
    id="private-project-badge-tooltip"
    tooltip={PrivateTooltip}
    target={<span className="project-badge private-project-badge" aria-label={PrivateTooltip} />}
  />
);

const PrivateToggle = ({ isPrivate, setPrivate }) => (
  <TooltipContainer
    type="action"
    id="toggle-private-button-tooltip"
    tooltip={isPrivate ? PrivateTooltip : PublicTooltip}
    target={
      <CheckboxButton onChange={setPrivate}>
        <span className="project-badge private-project-badge" aria-label={PublicTooltip} />
      </CheckboxButton>
    }
  />
);

const ReadmeError = (error) =>
  error && error.response && error.response.status === 404 ? (
    <>
      This project would be even better with a <code>README.md</code>
    </>
  ) : (
    <>We couldn{"'"}t load the readme. Try refreshing?</>
  );
const ReadmeLoader = ({ domain }) => (
  <DataLoader get={(api) => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({ data }) => (
      <Expander height={250}>
        <Markdown>{data.toString()}</Markdown>
      </Expander>
    )}
  </DataLoader>
);

ReadmeLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

function DeleteProjectPopover({ projectDomain, deleteProject }) {
  const { currentUser } = useCurrentUser();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (done) {
      window.location = getUserLink(currentUser);
    }
  }, [done, currentUser]);

  return (
    <section>
      <PopoverWithButton
        buttonProps={{ size: 'small', type: 'dangerZone', emoji: 'bomb' }}
        buttonText="Delete Project"
      >
        {({ togglePopover }) => (
          <PopoverDialog align="left" wide>
            <PopoverActions>
              <ActionDescription>You can always undelete a project from your profile page.</ActionDescription>
            </PopoverActions>
            <PopoverActions type="dangerZone">
              {loading ? (
                <Loader />
              ) : (
                <Button
                  type="tertiary"
                  size="small"
                  emoji="bomb"
                  onClick={() => {
                    setLoading(true);
                    deleteProject().then(() => {
                      togglePopover();
                      setDone(true);
                    });
                  }}
                >
                  Delete {projectDomain}
                </Button>
              )}
            </PopoverActions>
          </PopoverDialog>
        )}
      </PopoverWithButton>
    </section>
  );
}

DeleteProjectPopover.propTypes = {
  deleteProject: PropTypes.func.isRequired,
};

const ProjectPage = ({ project: initialProject }) => {
  const [project, { addProjectToCollection, updateDomain, updateDescription, updatePrivate, deleteProject, uploadAvatar }] = useProjectEditor(
    initialProject,
  );

  const { currentUser } = useCurrentUser();
  const isAuthorized = userIsProjectMember({ project, user: currentUser });
  const { domain, users, teams, suspendedReason } = project;
  return (
    <main className="project-page">
      <section id="info">
        <ProjectProfileContainer
          currentUser={currentUser}
          project={project}
          isAuthorized={isAuthorized}
          avatarActions={{
            'Upload Avatar': isAuthorized ? uploadAvatar : null,
          }}
        >
          <Heading tagName="h1">
            {isAuthorized ? (
              <ProjectDomainInput
                domain={domain}
                onChange={(newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain))}
                privacy={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate} />}
              />
            ) : (
              <>
                {!currentUser.isSupport && suspendedReason ? 'suspended project' : domain} {project.private && <PrivateBadge />}
              </>
            )}
          </Heading>
          {users.length + teams.length > 0 && (
            <div>
              <ProfileList hasLinks teams={teams} users={users} layout="block" />
            </div>
          )}
          <AuthDescription
            authorized={isAuthorized}
            description={!currentUser.isSupport && !isAuthorized && suspendedReason ? 'suspended project' : project.description}
            update={updateDescription}
            placeholder="Tell us about your app"
          />
          <div>
            <span className="project-page__profile-button">
              <ShowButton name={domain} />
            </span>
            <span className="project-page__profile-button">
              <EditButton name={domain} isMember={isAuthorized} />
            </span>
          </div>
        </ProjectProfileContainer>
      </section>
      <div className="project-embed-wrap">
        <ProjectEmbed
          project={project}
          isAuthorized={isAuthorized}
          currentUser={currentUser}
          addProjectToCollection={(_, collection) => addProjectToCollection(collection)}
        />
      </div>
      <section id="readme">
        <ReadmeLoader domain={domain} />
      </section>

      {isAuthorized && <DeleteProjectPopover projectDomain={project.domain} currentUser={currentUser} deleteProject={deleteProject} />}

      <section id="included-in-collections">
        <IncludedInCollections projectId={project.id} />
      </section>
      <section id="related">
        <RelatedProjects project={project} />
      </section>
    </main>
  );
};
ProjectPage.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
};

async function addProjectBreadcrumb(projectWithMembers) {
  const { users, teams, ...project } = projectWithMembers;
  addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return projectWithMembers;
}

const ProjectPageContainer = ({ name: domain }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'project' }}>
      <DataLoader get={(api) => getProjectByDomain(api, domain).then(addProjectBreadcrumb)} renderError={() => <NotFound name={domain} />}>
        {(project) =>
          project ? (
            <>
              <Helmet title={project.domain} />
              <ProjectPage project={project} />
            </>
          ) : (
            <NotFound name={domain} />
          )
        }
      </DataLoader>
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;
