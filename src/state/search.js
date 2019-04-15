/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect, useReducer } from 'react';
import { mapValues, sumBy } from 'lodash';
import { useAPI } from './api';
import { allByKeys } from '../../shared/api';
import useErrorHandlers from '../presenters/error-handlers';
import starterKits from '../curated/starter-kits';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

// TODO: this is super hacky; this would probably work a lot better with algolia
const normalize = (str) =>
  (str || '')
    .trim()
    .replace(/[^\w\d\s]/g, '')
    .toLowerCase();

function findStarterKits(query) {
  const normalizedQuery = normalize(query);
  return starterKits.filter((kit) => kit.keywords.includes(normalizedQuery)).map((kit) => ({ type: 'starterKit', ...kit }));
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


const reducer = (state, action) => {
  if (action.type)

}


// search provider logic -- shared between algolia & legacy API
function useSearchProvider(provider, query, params) {
  const { handleError } = useErrorHandlers();
  const emptyResults = mapValues(provider, () => []);
  const [state, dispatch] = useReducer(reducer, {
    status: 'init',
    totalHits: 0,
    topResults: [],
    ...emptyResults,
  })
  
  
  const [results, setResults] = useState(emptyResults);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    if (!query) {
      setResults(emptyResults);
      return;
    }
    setStatus('loading');
    allByKeys(mapValues(provider, (index) => index(query, params)))
      .then((res) => {
        setResults(res);
        setStatus('ready');
      })
      .catch(handleError);
  }, [query, params]);

  const totalHits = sumBy(Object.values(results), (items) => items.length);
  const resultsWithEmpties = { ...emptyResults, ...results };

  return {
    status,
    totalHits,
    topResults: getTopResults(resultsWithEmpties, query),
    ...resultsWithEmpties,
  };
}

// algolia search

const searchIndices = {
  team: searchClient.initIndex('search_teams'),
  user: searchClient.initIndex('search_users'),
  project: searchClient.initIndex('search_projects'),
  collection: searchClient.initIndex('search_collections'),
};

const formatByType = {
  user: (user) => ({
    ...user,
    id: Number(user.objectID.replace('user-', '')),
    thanksCount: user.thanks,
  }),
  team: (team) => ({
    users: [],
    isVerified: false,
    ...team,
    id: Number(team.objectID.replace('team-', '')),
  }),
  project: (project) => ({
    description: '',
    showAsGlitchTeam: false,
    ...project,
    id: project.objectID.replace('project-', ''),
    users: null,
    teams: null,
    userIDs: project.members,
    teamIDs: project.teams,
  }),
  collection: (collection) => ({
    coverColor: '#eee',
    color: '#eee',
    ...collection,
    id: Number(collection.objectID.replace('collection-', '')),
    team: null,
    user: null,
    teamIDs: collection.team > 0 ? [collection.team] : [],
    userIDs: collection.user > 0 ? [collection.user] : [],
  }),
};

const formatAlgoliaResult = (type) => ({ hits }) =>
  hits.map((value) => ({
    type,
    ...formatByType[type](value),
  }));

const algoliaProvider = {
  ...mapValues(searchIndices, (index, type) => (query) => index.search({ query, hitsPerPage: 100 }).then(formatAlgoliaResult(type))),
  project: (query, { notSafeForKids }) =>
    searchIndices.project
      .search({
        query,
        hitsPerPage: 100,
        facetFilters: [notSafeForKids ? '' : 'notSafeForKids:false'],
      })
      .then(formatAlgoliaResult('project')),
  starterKit: (query) => Promise.resolve(findStarterKits(query)),
};

const defaultParams = { notSafeForKids: false };

export function useAlgoliaSearch(query, params = defaultParams) {
  return useSearchProvider(algoliaProvider, query, params);
}

// legacy search

const formatLegacyResult = (type) => ({ data }) => data.map((value) => ({ type, ...value }));

const getLegacyProvider = (api) => ({
  team: (query) => api.get(`teams/search?q=${query}`).then(formatLegacyResult('team')),
  user: (query) => api.get(`users/search?q=${query}`).then(formatLegacyResult('user')),
  project: (query) => api.get(`projects/search?q=${query}`).then(formatLegacyResult('project')),
  collection: () => Promise.resolve([]),
  starterKit: (query) => Promise.resolve(findStarterKits(query)),
});

export function useLegacySearch(query) {
  const api = useAPI();
  const legacyProvider = getLegacyProvider(api);
  return useSearchProvider(legacyProvider, query);
}
