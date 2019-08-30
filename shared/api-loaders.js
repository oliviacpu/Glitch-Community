const { getSingleItem, getAllPages, allByKeys } = require('./api');

async function getProject(api, id, idType = 'id') {
  const project = await getSingleItem(`v1/projects/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!project) return project;
  const data = await allByKeys({
    teams: getAllPages(api, `v1/projects/by/id/teams?id=${project.id}&limit=100`),
    users: getAllPages(api, `v1/projects/by/id/users?id=${project.id}&limit=100`),
  });
  return { ...project, ...data };
}

async function getUser(api, id, idType = 'id') {
  const user = await getSingleItem(api, `v1/users/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!user) return user;
  const data = await allByKeys({
    pins: getAllPages(api, `v1/users/by/id/pinnedProjects?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    projects: getAllPages(api, `v1/users/by/id/projects?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    teams: getAllPages(api, `v1/users/by/id/teams?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    collections: getAllPages(api, `v1/users/by/id/collections?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
  });
  return { ...user, ...data };
}

module.exports = {
  getProject,
  getUser,
};
