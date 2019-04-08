/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';
import { groupBy, sample } from 'lodash';
import { useAPI } from './api';
import { allByKeys } from '../../shared/api';
import useErrorHandlers from '../presenters/error-handlers';
import starterKits from '../curated/starter-kits';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this really ought to be in the raw data
function formatUser(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    color: '',
  };
}

function formatTeam(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    hasCoverImage: false,
    hasAvatarImage: false,
    isVerified: false,
    url: '',
    users: [],
  };
}

function formatProject(hit) {
  return {
    ...hit,
    id: hit.objectID.replace('project-', ''),
    description: '',
    users: [],
    showAsGlitchTeam: false,
    teams: [],
  };
}

function formatCollection(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    coverColor: sample(['#cff', '#fcf', '#ffc', '#ccf', '#cfc', '#fcc']),
    projects: [],
    url: '',
    teamId: hit.team,
    userId: hit.user,
    team: hit.team > 0 ? { id: hit.team, url: '' } : null,
    user: hit.user > 0 ? { id: hit.user, login: '' } : null,
  };
}

// TODO: this is super hacky; this would probably work a lot better with algolia
const normalize = (str) => (str || '').trim().replace(/[^\w\d\s]/g, '').toLowerCase();

function findStarterKits(query) {
  const normalizedQuery = normalize(query);
  return starterKits.filter((kit) => kit.keywords.includes(normalizedQuery));
}

// top results

// byPriority('domain', 'name') -- first try to match domain, then try matching name, then return `null`
const byPriority = (...prioritizedKeys) => (items, query) => {
  const normalizedQuery = normalize(query);
  for (const key of prioritizedKeys) {
    const match = items.find((item) => normalize(item[key]) === normalizedQuery);
    if (match) return match;
  }
  return null;
};

const findTop = {
  project: byPriority('domain', 'name'),
  team: byPriority('url', 'name'),
  user: byPriority('login', 'name'),
};

const getTopResults = (resultsByType, query) =>
  [findTop.project(resultsByType.project, query), findTop.team(resultsByType.team, query), findTop.user(resultsByType.user, query)].filter(Boolean);

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit);
    case 'team':
      return formatTeam(hit);
    case 'project':
      return formatProject(hit);
    case 'collection':
      return formatCollection(hit);
    default:
      return hit;
  }
}

const emptyResults = { team: [], user: [], project: [], collection: [], starterKit: [] };

export function useAlgoliaSearch(query) {
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    if (!query) {
      setHits([]);
      return;
    }
    setStatus('loading');
    searchIndex
      .search({
        query,
        hitsPerPage: 500,
      })
      .then((res) => {
        setHits(res.hits.map(formatHit));
        setStatus('ready');
      });
  }, [query]);

  const resultsByType = { ...emptyResults, ...groupBy(hits, (hit) => hit.type) };

  return {
    status,
    totalHits: hits.length,
    topResults: getTopResults(resultsByType, query),
    ...resultsByType,
    starterKit: findStarterKits(query),
  };
}

const formatLegacyResult = (type) => (hit) => ({ ...hit, type });

async function searchTeams(api, query) {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data.map(formatLegacyResult('team'));
}

async function searchUsers(api, query) {
  const { data } = await api.get(`users/search?q=${query}`);
  return data.map(formatLegacyResult('user'));
}

async function searchProjects(api, query) {
  const { data } = await api.get(`projects/search?q=${query}`);
  return data.map(formatLegacyResult('project'));
}

// This API is slow and is missing important data (so its unfit for production)
// But its still useful for comparing against Algolia
// eslint-disable-next-line no-unused-vars
async function searchCollections(api, query) {
  const { data } = await api.get(`collections/search?q=${query}`);
  // NOTE: collection URLs don't work correctly with these
  return data.map((coll) => ({
    ...coll,
    type: 'collection',
    team: coll.teamId > 0 ? { id: coll.teamId } : null,
    user: coll.userId > 0 ? { id: coll.userId } : null,
  }));
}

export function useLegacySearch(query) {
  const api = useAPI();
  const { handleError } = useErrorHandlers();
  const [results, setResults] = useState(emptyResults);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    setStatus('loading');
    allByKeys({
      team: searchTeams(api, query),
      user: searchUsers(api, query),
      project: searchProjects(api, query),
      // collection: searchCollections(api, query),
      collection: Promise.resolve([]),
    })
      .then((res) => {
        setStatus('ready');
        setResults(res);
      })
      .catch(handleError);
  }, [query]);

  //   TODO: do I need total hits?
  const allHits = [...results.team, ...results.user, ...results.project, ...results.collection];

  return {
    ...emptyResults,
    status,
    totalHits: allHits.length,
    topResults: getTopResults(results, query),
    starterKit: findStarterKits(query),
    ...results,
  };
}