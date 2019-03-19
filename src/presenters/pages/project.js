/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { getAvatarUrl } from '../../models/project';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

import { AnalyticsContext } from '../analytics';
import TooltipContainer from '../../components/tooltips/tooltip-container';
import { DataLoader } from '../includes/loader';
import NotFound from '../includes/not-found';
import Heading from '../../components/text/heading';
import Markdown from '../../components/text/markdown';
import ProjectEditor from '../project-editor';
import Expander from '../includes/expander';
import EditableField from '../includes/editable-field';
import Embed from '../includes/embed';
import { AuthDescription } from '../includes/description-field';
import { InfoContainer, ProjectInfoContainer } from '../includes/profile';
import { ShowButton, EditButton, RemixButton } from '../includes/project-actions';
import ReportButton from '../pop-overs/report-abuse-pop';
import AddProjectToCollection from '../includes/add-project-to-collection';
import TeamsList from '../teams-list';
import UsersList from '../users-list';
import RelatedProjects from '../includes/related-projects';
import IncludedInCollections from '../includes/included-in-collections';
import { addBreadcrumb } from '../../utils/sentry';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

import Layout from '../layout';

function trackRemix(id, domain) {
  analytics.track('Click Remix', {
    origin: 'project page',
    baseProjectId: id,
    baseDomain: domain,
  });
}

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const PrivateTooltip = 'Only members can view code';
const PublicTooltip = 'Visible to everyone';

const PrivateBadge = () => (
  <TooltipContainer
    type="info"
    id="private-project-badge-tooltip"
    tooltip={PrivateTooltip}
    target={<span className="project-badge private-project-badge" />}
  />
);

const PrivateToggle = ({ isPrivate, setPrivate }) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = 'button-tertiary button-on-secondary-background project-badge';
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';

  return (
    <TooltipContainer
      type="action"
      id="toggle-private-button-tooltip"
      target={<button onClick={() => setPrivate(!isPrivate)} className={`${classBase} ${className}`} type="button" />}
      tooltip={tooltip}
    />
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const ReadmeError = (error) =>
  error && error.response && error.response.status === 404 ? (
    <>
      This project would be even better with a <code>README.md</code>
    </>
  ) : (
    <>We couldn{"'"}t load the readme. Try refreshing?</>
  );
const ReadmeLoader = ({ api, domain }) => (
  <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({ data }) => (
      <Expander height={250}>
        <Markdown>{data.toString()}</Markdown>
      </Expander>
    )}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  api: PropTypes.any,
  domain: PropTypes.string.isRequired,
};
ReadmeLoader.defaultProps = {
  api: null,
};

const ProjectPage = ({ project, addProjectToCollection, api, currentUser, isAuthorized, updateDomain, updateDescription, updatePrivate }) => {
  const { domain, users, teams } = project;
  return (
    <main className="project-page">
      <section id="info">
        <InfoContainer>
          <ProjectInfoContainer style={{ backgroundImage: `url('${getAvatarUrl(project.id)}')` }}>
            <Heading tagName="h1">
              {isAuthorized ? (
                <EditableField
                  value={domain}
                  placeholder="Name your project"
                  update={(newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain))}
                  suffix={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate} />}
                />
              ) : (
                <>
                  {domain} {project.private && <PrivateBadge />}
                </>
              )}
            </Heading>
            <div className="users-information">
              <UsersList users={users} />
              {!!teams.length && <TeamsList teams={teams} />}
            </div>
            <AuthDescription
              authorized={isAuthorized}
              description={project.description}
              update={updateDescription}
              placeholder="Tell us about your app"
            />
            <p className="buttons">
              <ShowButton name={domain} />
              <EditButton name={domain} isMember={isAuthorized} />
            </p>
          </ProjectInfoContainer>
        </InfoContainer>
      </section>
      <section id="embed">
        <Embed domain={domain} />
        <div className="buttons space-between">
          <ReportButton reportedType="project" reportedModel={project} />
          <div>
            {currentUser.login && (
              <AddProjectToCollection
                className="button-small margin"
                api={api}
                currentUser={currentUser}
                project={project}
                fromProject
                addProjectToCollection={addProjectToCollection}
              />
            )}
            <RemixButton className="button-small margin" name={domain} isMember={isAuthorized} onClick={() => trackRemix(project.id, domain)} />
          </div>
        </div>
      </section>
      <section id="readme">
        <ReadmeLoader api={api} domain={domain} />
      </section>
      <section id="included-in-collections">
        <IncludedInCollections api={api} projectId={project.id} />
      </section>
      <section id="related">
        <RelatedProjects ignoreProjectId={project.id} {...{ api, teams, users }} />
      </section>
    </main>
  );
};
ProjectPage.propTypes = {
  api: PropTypes.any,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
};

ProjectPage.defaultProps = {
  api: null,
};

async function getProject(api, domain) {
  const data = await allByKeys({
    project: getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain),
    teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });

  const { project, ...rest } = data;
  addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return { ...project, ...rest };
}

const ProjectPageLoader = ({ domain, ...props }) => {
  const api = useAPI();
  const currentUser = useCurrentUser();
  return (
    <DataLoader get={() => getProject(api, domain)} renderError={() => <NotFound name={domain} />}>
      {(project) =>
        project ? (
          <ProjectEditor api={api} initialProject={project}>
            {(currentProject, funcs, userIsMember) => (
              <>
                <Helmet>
                  <title>{currentProject.domain}</title>
                </Helmet>
                <ProjectPage api={api} project={currentProject} {...funcs} isAuthorized={userIsMember} currentUser={currentUser} {...props} />
              </>
            )}
          </ProjectEditor>
        ) : (
          <NotFound name={domain} />
        )
      }
    </DataLoader>
  );
};
ProjectPageLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ProjectPageContainer = ({ name }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'project' }}>
      <ProjectPageLoader domain={name} />
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;
