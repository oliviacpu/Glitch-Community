/// A locally cached minimal api wrapper

const axios = require('axios');
const { Cache } = require('memory-cache');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');

const { API_URL } = require('./constants').current;
const { allByKeys } = require('Shared/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

const batches = new Map();
async function getBatchedEntity(type, field, value) {
  const key = `${type}:${field}`;
  if (!batches.has(key)) {
    const promise = new Promise((resolve) => setTimeout(() => {
      const [values] = batches.get(key);
      batches.delete(key);
      const query = values.map((value) => `${field}=${encodeURIComponent(value)}`).join('&');
      resolve(api.get(`v1/${type}/by/${field}?${query}`));
    }, 1000));
    batches.set(key, [[], promise]);
  }
  const [values, promise] = batches.get(key);
  batches.set(key, [[...values, value], promise]);
  return promise.then((data) => {
    if (data[value]) return data[value];
    const realValue = Object.keys(data).find((key) => key.toLowerCase() === value.toLowerCase());
    if (realValue) return data[realValue];
    return null;
  });
}

async function getProjectFromApi(domain) {
  const { project, teams, users } = await allByKeys({
    project: getBatchedEntity('projects', 'domain', domain),
    // teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    // users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });
  return project && { ...project, teams, users };
}

function getTeamFromApi(url) {
  return getBatchedEntity('teams', 'url', url);
}

function getUserFromApi(login) {
  return getBatchedEntity('users', 'login', login);
}

function getCollectionFromApi(login, collection) {
  const url = `${login}/${collection}`;
  return getBatchedEntity('collections', 'fullUrl', url);
}

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';

  const response = await api.get(`https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`);
  return response.data.posts;
}

const CACHE_TIMEOUT = dayjs.convert(1, 'hour', 'ms');
const cache = new Cache();

async function getFromCacheOrApi(key, api, ...args) {
  let promise = cache.get(key);
  let trackError = false;
  if (!promise) {
    trackError = true;
    promise = api(...args);
    cache.put(key, promise, CACHE_TIMEOUT);
  }
  try {
    return await promise;
  } catch (error) {
    if (trackError) {
      console.warn(`Failed to load ${key}: ${error.toString()}`);
      captureException(error); // it'll probably get filtered out by beforeSend
    }
    return null;
  }
}

module.exports = {
  getProject: (domain) => getFromCacheOrApi(`project ${domain}`, getProjectFromApi, domain),
  getTeam: (url) => getFromCacheOrApi(`team ${url}`, getTeamFromApi, url),
  getUser: (login) => getFromCacheOrApi(`user ${login}`, getUserFromApi, login),
  getCollection: (login, collection) => getFromCacheOrApi(`collection ${login}/${collection}`, getCollectionFromApi, login, collection),
  getZine: () => getFromCacheOrApi('culture zine', getCultureZinePosts),
};
