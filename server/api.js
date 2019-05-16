/// A locally cached minimal api wrapper

const axios = require('axios');
const { Cache } = require('memory-cache');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');

const { API_URL } = require('./constants').current;
const { getSingleItem } = require('Shared/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

function getProjectFromApi(domain) {
  return getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain);
}

function getTeamFromApi(url) {
  return getSingleItem(api, `v1/teams/by/url?url=${encodeURIComponent(url)}`, url);
}

function getUserFromApi(login) {
  return getSingleItem(api, `v1/users/by/login?login=${encodeURIComponent(login)}`, login);
}

function getCollectionFromApi(login, collection) {
  const url = `${login}/${collection}`;
  const encodedUrl = `${encodeURIComponent(login)}/${encodeURIComponent(collection)}`;
  return getSingleItem(api, `v1/collections/by/fullUrl?fullUrl=${encodedUrl}`, url);
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
