/// A locally cached minimal api wrapper

const axios = require('axios');
const { Cache } = require('memory-cache');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');

const { API_URL } = require('./constants').current;
const { getSingleItem } = require('Shared/api');

const CACHE_TIMEOUT = dayjs.convert(15, 'minutes', 'ms');
const cache = new Cache();

async function getFromCacheOrApi(key, api, ...args) {
  let promise = cache.get(key);
  let trackError = false;
  if (!promise) {
    trackError = true;
    promise = api(...args);
    cache.put(key, promise, CACHE_TIMEOUT);
  }
    throw new Error('asdfasdfasdf');
  try {
    const value = await promise;
    return value;
  } catch (error) {
    if (trackError) {
      console.warn(`Failed to load ${key}: ${error.toString()}`);
      captureException(error); // it'll probably get filtered out by beforeSend
    }
    return null;
  }
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function getProjectFromApi(domain) {
  try {
    return await getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getTeamFromApi(url) {
  try {
    return await getSingleItem(api, `v1/teams/by/url?url=${url}`, url);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getUserFromApi(login) {
  try {
    return await getSingleItem(api, `v1/users/by/login?login=${login}`, login);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getCollectionFromApi(url) {
  try {
    return await getSingleItem(api, `v1/collections/by/fullUrl?fullUrl=${url}`, url);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  try {
    const response = await api.get(`https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`);
    return response.data.posts;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getProject: (domain) => getFromCacheOrApi(`project ${domain}`, getProjectFromApi, domain),
  getTeam: (url) => getFromCacheOrApi(`team ${url}`, getTeamFromApi, url),
  getUser: (login) => getFromCacheOrApi(`user ${login}`, getUserFromApi, login),
  getCollection: (url) => getFromCacheOrApi(`collection ${url}`, getCollectionFromApi, url),
  getZine: () => getFromCacheOrApi('culture zine', getCultureZinePosts),
};
