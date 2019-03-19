import React from 'react';
import PropTypes from 'prop-types';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';
import { useAPI } from '../../state/api';

import { DataLoader } from '../includes/loader';
import NotFound from '../includes/not-found';

import Layout from '../layout';
import TeamPage from './team';
import UserPage from './user';

const mergeUserData = (data) => {
  const { user, ...rest } = data;
  return { ...user, ...rest };
};

// TODOs:
// this works pretty well, even for users with lots of projects,
// but we should consider pushing the API calls down to the individiual components,
// instead of handling them at the page level.
// none of them _have to_ load in any particular order,
// and pagination needs to be closely integrated with the UI anyways.
const getUserById = async (api, id) => {
  const data = await allByKeys({
    user: getSingleItem(api, `v1/users/by/id?id=${id}`, id),
    pins: getAllPages(api, `v1/users/by/id/pinnedProjects?id=${id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    projects: getAllPages(api, `v1/users/by/id/projects?id=${id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    teams: getAllPages(api, `v1/users/by/id/teams?id=${id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    collections: getAllPages(api, `v1/users/by/id/collections?id=${id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
  });
  return mergeUserData(data);
};

const getUserByLogin = async (api, name) => {
  const data = await allByKeys({
    user: getSingleItem(api, `v1/users/by/login?login=${name}`, name),
    pins: getAllPages(api, `v1/users/by/login/pinnedProjects?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    projects: getAllPages(api, `v1/users/by/login/projects?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    teams: getAllPages(api, `v1/users/by/login/teams?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    collections: getAllPages(api, `v1/users/by/login/collections?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
  });
  return mergeUserData(data);
};

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.teamPermissions.filter((user) => user.accessLevel === ADMIN_ACCESS_LEVEL);
  team.adminIds = adminIds.map((user) => user.userId);
  return team;
};

const getTeam = async (api, name) => {
  const team = await getSingleItem(api, `v1/teams/by/url?url=${name}`, name);
  if (team) {
    const [users, pinnedProjects, projects, collections] = await Promise.all([
      // load all users, need to handle pagination
      getAllPages(api, `v1/teams/by/id/users?id=${team.id}&orderKey=createdAt&orderDirection=ASC&limit=100`),
      getAllPages(api, `v1/teams/by/id/pinnedProjects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
      getAllPages(api, `v1/teams/by/id/projects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
      getAllPages(api, `v1/teams/by/id/collections?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    ]);

    team.users = users.sort((a, b) => new Date(a.teamPermission.updatedAt) - new Date(b.teamPermission.updatedAt));
    team.projects = projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    team.teamPins = pinnedProjects.map((project) => ({ projectId: project.id }));
    team.collections = collections;
  }
  return team && parseTeam(team);
};

const TeamPageLoader = ({ id, name, ...props }) => {
  const api = useAPI();
  return (
    <DataLoader get={() => getTeam(api, name)}>
      {(team) => (team ? <TeamPage api={api} team={team} {...props} /> : <NotFound name={name} />)}
    </DataLoader>
  );
};
TeamPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const UserPageLoader = ({ id, name, ...props }) => {
  const api = useAPI();
  return (
    <DataLoader get={() => getUserById(api, id)}>
      {(user) => (user ? <UserPage api={api} user={user} {...props} /> : <NotFound name={name} />)}
    </DataLoader>
  );
};
UserPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const TeamOrUserPageLoader = ({ name, ...props }) => {
  const api = useAPI();
  return (
    <DataLoader get={() => getTeam(api, name)}>
      {(team) =>
        team ? (
          <TeamPage team={team} api={api} {...props} />
        ) : (
          <DataLoader get={() => getUserByLogin(api, name)}>
            {(user) => (user ? <UserPage user={user} api={api} {...props} /> : <NotFound name={name} />)}
          </DataLoader>
        )
      }
    </DataLoader>
  );
};
TeamOrUserPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

const withLayout = (Loader) => (props) => (
  <Layout>
    <Loader {...props} />
  </Layout>
);

const TeamPagePresenter = withLayout(TeamPageLoader);
const UserPagePresenter = withLayout(UserPageLoader);
const TeamOrUserPagePresenter = withLayout(TeamOrUserPageLoader);
export { TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage };
