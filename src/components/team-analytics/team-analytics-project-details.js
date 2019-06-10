import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Text from 'Components/text/text';
import { ProjectLink } from 'Components/link';
import Loader from 'Components/loader';
import { FALLBACK_AVATAR_URL, getAvatarUrl } from 'Models/project';
import { createAPIHook } from 'State/api';

import ProjectAvatar from '../../presenters/includes/project-avatar';

const RECENT_REMIXES_COUNT = 100;

// This uses dayjs().fromNow() a bunch of times
// That requires the relativeTime plugin
// Which is added to dayjs elsewhere
const ProjectDetails = ({ projectDetails }) => (
  <article className="project-details">
    <ProjectLink project={projectDetails}>
      <ProjectAvatar {...projectDetails} />
    </ProjectLink>
    <table>
      <tbody>
        <tr>
          <td className="label">Name</td>
          <td>{projectDetails.domain}</td>
        </tr>
        <tr>
          <td className="label">Created</td>
          <td>{dayjs(projectDetails.createdAt).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last viewed</td>
          <td>{dayjs(projectDetails.lastAccess).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last edited</td>
          <td>{dayjs(projectDetails.lastEditedAt).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last remixed</td>
          <td>{projectDetails.lastRemixedAt ? dayjs(projectDetails.lastRemixedAt).fromNow() : 'never'}</td>
        </tr>
        <tr>
          <td className="label">Total app views</td>
          <td>{projectDetails.numAppVisits}</td>
        </tr>
        <tr>
          <td className="label">Total code views</td>
          <td>{projectDetails.numEditorVisits}</td>
        </tr>
        <tr>
          <td className="label">Total direct remixes</td>
          <td>{projectDetails.numDirectRemixes}</td>
        </tr>
        <tr>
          <td className="label">Total remixes</td>
          <td>{projectDetails.numTotalRemixes}</td>
        </tr>
        {projectDetails.baseProject.domain && (
          <tr>
            <td className="label">Originally remixed from</td>
            <td>
              <ProjectLink project={projectDetails.baseProject}>
                <ProjectAvatar project={projectDetails.baseProject} className="baseproject-avatar" />
                {projectDetails.baseProject.domain}
              </ProjectLink>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </article>
);

const ProjectRemixItem = ({ remix }) => (
  <ProjectLink project={remix}>
    <TooltipContainer
      id={`project-remix-tooltip-${remix.domain}`}
      target={<ProjectAvatar project={remix} />}
      align={['left']}
      type="action"
      tooltip={remix.domain}
    />
  </ProjectLink>
);

const useProjectDetails = createAPIHook(async (api, id, currentProjectDomain) => {
  const { data } = await api.get(`analytics/${id}/project/${currentProjectDomain}/overview`);
  return data;
});

function TeamAnalyticsProjectDetails({ activeFilter, id, currentProjectDomain }) {
  const { value: projectDetails } = useProjectDetails(id, currentProjectDomain);
  if (!projectDetails) return <Loader />;
  
  const projectRemixes = projectDetails.remixes.slice(0, RECENT_REMIXES_COUNT);
  return (
    <>
      <ProjectDetails projectDetails={projectDetails} />
      {activeFilter === 'remixes' && (
        <article className="project-remixes">
          <h4>Latest Remixes</h4>
          <div className="project-remixes-container">
            {projectRemixes.length === 0 && <Text>No remixes yet (／_^)／ ●</Text>}
            {projectRemixes.map((remix) => (
              <ProjectRemixItem key={remix.id} remix={remix} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

TeamAnalyticsProjectDetails.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default TeamAnalyticsProjectDetails;
