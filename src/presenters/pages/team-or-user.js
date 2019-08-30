import React from 'react';
import PropTypes from 'prop-types';

import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { getSingleItem, getAllPages } from 'Shared/api';
import { getUser } from 'Shared/api-loaders';

import TeamPage from './team';
import UserPage from './user';

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.teamPermissions.filter((user) => user.accessLevel === ADMIN_ACCESS_LEVEL);
  team.adminIds = adminIds.map((user) => user.userId);
  return team;
};

const getTeam = async (api, name) => {
  const team = await getSingleItem(api, `v1/teams/by/url?url=${encodeURIComponent(name)}`, name);
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

const TeamPageLoader = ({ name, ...props }) => (
  <DataLoader get={(api) => getTeam(api, name)} renderError={() => <NotFound name={name} />}>
    {(team) => <TeamPage team={team} {...props} />}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const UserPageLoader = ({ id, name, ...props }) => (
  <DataLoader get={(api) => getUser(api, id, 'id')} renderError={() => <NotFound name={name} />}>
    {(user) => <UserPage user={user} {...props} />}
  </DataLoader>
);

UserPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const TeamOrUserPageLoader = ({ name, ...props }) => (
  <DataLoader get={(api) => getTeam(api, name)}>
    {(team) =>
      team ? (
        <TeamPage team={team} {...props} />
      ) : (
        <DataLoader get={(api) => getUser(api, name, 'login')} renderError={() => <NotFound name={`@${name}`} />}>
          {(user) => <UserPage user={user} {...props} />}
        </DataLoader>
      )
    }
  </DataLoader>
);
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
