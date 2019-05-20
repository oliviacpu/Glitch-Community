import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sampleSize, difference } from 'lodash';

import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import { TeamLink, UserLink } from 'Components/link';
import { getDisplayName } from '../../models/user';

const PROJECT_COUNT = 3;

const RelatedProjectsBody = ({ projects, type, item }) =>
  projects.length > 0 ? (
    <CoverContainer type={type} item={item}>
      <div className="related-projects__projects-wrap">
        <ProjectsList layout="row" projects={projects} />
      </div>
    </CoverContainer>
  ) : null;

RelatedProjectsBody.propTypes = {
  projects: PropTypes.array.isRequired,
};


const getProjects = {
  team: {
    pinned: (id) => `/v1/teams/by/id/pinnedProjects
  }
}

const getTeam = (api, id) => api.get(`teams/${id}`).then(({ data }) => data);
const getTeamPins = (api, id) => api.get(`teams/${id}/pinned-projects`).then(({ data }) => data);
const getUser = (api, id) => api.get(`users/${id}`).then(({ data }) => data);
const getUserPins = (api, id) => api.get(`users/${id}/pinned-projects`).then(({ data }) => data);

async function getProjects(api, { type, id, ignoreProjectId }) {
  const getPins = type === 'team' ? getTeamPins : getUserPins;
  const getAllProjects = type === 'team' ? getTeam : getUser;

  const [pins, recents] = await Promise.all([
    api.get(`/v1/${type}s/by/id/pinnedProjects?id=${id}`).then(res => res.data.items),
    api.get(`/v1/${type}s/by/id/projects?id=${id}`).then(res => res.data.items),
  ])
  
  const allProjects = pins.concat(recents).filter(project => project.id !== ignoreProjectId)
  const sample = sampleSize(allProjects,
  
  const pinIds = pins.map((pin) => pin.projectId);
  let ids = sampleSize(difference(pinIds, [ignoreProjectId]), PROJECT_COUNT);

  if (ids.length < PROJECT_COUNT) {
    const { projects } = await getAllProjects(api, id);

    const allIds = projects.map((project) => project.id);
    const remainingIds = difference(allIds, [ignoreProjectId, ...ids]);
    ids = [...ids, ...sampleSize(remainingIds, PROJECT_COUNT - ids.length)];
  }

  if (ids.length) {
    const { data } = await api.get(`projects/byIds?ids=${ids.join(',')}`);

    return data.length ? data : null;
  }
  return null;
}

function useSample(items, count) {
  const [sample, setSample] = useState([]);
  useEffect(() => {
    setSample(sampleSize(items, count));
  }, [count, ...items.map((item) => item.id)]);
  return sample;
}

function RelatedProjects({ teams: allTeams, users: allUsers, ignoreProjectId }) {
  const teams = useSample(allTeams, 1);
  const users = useSample(allUsers, 2 - teams.length);

  if (!teams.length && !users.length) {
    return null;
  }
  return (
    <ul className="related-projects">
      {teams.map((team) => (
        <li key={team.id}>
          <DataLoader get={(api) => getProjects(api, { type: 'team', id: team.id, ignoreProjectId })}>
            {(projects) =>
              projects && (
                <>
                  <h2>
                    <TeamLink team={team}>More by {team.name} →</TeamLink>
                  </h2>
                  <RelatedProjectsBody projects={projects} type="team" item={team} />
                </>
              )
            }
          </DataLoader>
        </li>
      ))}
      {users.map((user) => (
        <li key={user.id}>
          <DataLoader get={(api) => getProjects(api, { type: 'user', id: user.id, ignoreProjectId })}>
            {(projects) =>
              projects && (
                <>
                  <h2>
                    <UserLink user={user}>More by {getDisplayName(user)} →</UserLink>
                  </h2>
                  <RelatedProjectsBody projects={projects} type="user" item={user} />
                </>
              )
            }
          </DataLoader>
        </li>
      ))}
    </ul>
  );
}
RelatedProjects.propTypes = {
  ignoreProjectId: PropTypes.string.isRequired,
  teams: PropTypes.array,
  users: PropTypes.array,
};

RelatedProjects.defaultProps = {
  teams: [],
  users: [],
};

export default RelatedProjects;
